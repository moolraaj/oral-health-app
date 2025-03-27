
import { dbConnect } from "@/database/database";
import HomeSlide from "@/models/Slider";
import { uploadPhotoToCloudinary } from "@/utils/Cloudinary";

import { NextRequest, NextResponse } from "next/server";

// get single slide
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: String }> }) {
    let id = (await params).id
    await dbConnect()
    if (!id) {
        return NextResponse.json({ error: 'Slide ID is missing' }, { status: 400 });
    }
    const slide = await HomeSlide.findOne({ _id: id });
    if (!slide) {
        return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Slide retrieved successfully', slide });
}


// delete single slide
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: String }> }) {
    let id = (await params).id
    await dbConnect()
    if (!id) {
        return NextResponse.json({ error: 'Slide ID is missing' }, { status: 400 });
    }
    const slide = await HomeSlide.findOne({ _id: id });
    if (!slide) {
        return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }
    await slide.deleteOne()
    return NextResponse.json({ message: 'Slide deleted successfully' });
}


// update single slide

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = (await params).id;
    const formData = await req.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const imageField = formData.get('image');  
    await dbConnect();
    if (!id) {
        return NextResponse.json({ error: 'Lesion ID is missing' }, { status: 400 });
    }
    const currentSlide = await HomeSlide.findById(id);
    if (!currentSlide) {
        return NextResponse.json({ error: 'Lesion not found' }, { status: 404 });
    }
    const updateFields: { [key: string]: any } = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (imageField && typeof imageField !== 'string') {
        try {
            const imageUrl = await uploadPhotoToCloudinary(imageField);
            updateFields.image = imageUrl;  
        } catch (error) {
            return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
        }
    }
    if (Object.keys(updateFields).length === 0) {
        return NextResponse.json({ error: 'No fields to update provided or values are the same.' }, { status: 400 });
    }
    const updatedLesion = await HomeSlide.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json({
        message: 'Slide updated successfully!',
        lesion: updatedLesion,
    });
}
