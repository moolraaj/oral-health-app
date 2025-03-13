
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import LesionModel from '@/models/Lesion';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import User from '@/models/User';


// get single lesion by ambassador

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const lesion = await LesionModel.findById(params.id).populate('submittedBy', 'name _id');

        if (!lesion) {
            return NextResponse.json({ error: 'Lesion not found' }, { status: 404 });
        }
        return NextResponse.json({
            message: 'Lesion retrieved successfully!',
            lesion,
        }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving lesion:', error);
        return NextResponse.json({ error: 'An error occurred while retrieving the lesion.' }, { status: 500 });
    }
}



// delete single lesion by ambassador

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        let id = (await params).id
        await dbConnect();
        let deletedLesion = await LesionModel.findOne({ _id: id })
        if (!deletedLesion) {
            return NextResponse.json({ error: 'Lesion id not found' }, { status: 404 });
        }
        await LesionModel.deleteOne()
        return NextResponse.json({
            message: 'Lesion deleted successfully!',
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting lesion:', error);
        return NextResponse.json({ error: 'please provide valid credentials' }, { status: 500 });
    }
}


// update lesion by ambassador

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    let id = (await params).id;
    const formData = await req.formData();  
    const fullName = formData.get('fullName');
    const age = formData.get('age');
    const gender = formData.get('gender');
    const contactNumber = formData.get('contactNumber');
    const location = formData.get('location');
    const symptoms = formData.get('symptoms');
    const duration = formData.get('duration');
    const habits = formData.get('habits');
    const previousDentalTreatments = formData.get('previousDentalTreatments');
    const submittedBy = formData.get('submittedBy');
    const images: File[] = formData.getAll('images') as File[];   
    await dbConnect();
    if (!id) {
      return NextResponse.json({ error: 'Lesion ID is missing' }, { status: 400 });
    }

    const currentLesion = await LesionModel.findById(id);
    if (!currentLesion) {
      return NextResponse.json({ error: 'Lesion not found' }, { status: 404 });
    }
    if (!submittedBy) {
      const user = await User.findById(submittedBy);
      if (!user) {
        return NextResponse.json({ error: `can't update the lesion please provide valid ambassador id` }, { status: 404 });
      }
    }
    const updateFields: { [key: string]: any } = {};
    if (fullName) updateFields.fullName = fullName;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;
    if (contactNumber) updateFields.contactNumber = contactNumber;
    if (location) updateFields.location = location;
    if (symptoms) updateFields.symptoms = symptoms;
    if (duration) updateFields.duration = duration;
    if (habits) updateFields.habits = habits;
    if (previousDentalTreatments) updateFields.previousDentalTreatments = previousDentalTreatments;
    if (submittedBy) updateFields.submittedBy = submittedBy;
    if (images && images.length > 0) {
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const imageUrl = await uploadPhotoToCloudinary(image);
        uploadedImageUrls.push(imageUrl);
      }
      updateFields.images = uploadedImageUrls;  
    }
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields to update provided or values are the same.' }, { status: 400 });
    }
    const updatedLesion = await LesionModel.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({
      message: 'Lesion updated successfully!',
      lesion: updatedLesion,
    });
  }


