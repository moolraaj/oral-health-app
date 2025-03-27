
import { dbConnect } from '@/database/database';
import HomeSlide from '@/models/Slider';
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        let imageUrl = '';
        const imageFile = formData.get('image');
        if (imageFile && typeof imageFile !== 'string') {
            imageUrl = await uploadPhotoToCloudinary(imageFile);
        } 
        const slide = await HomeSlide.create({ title, description, image:imageUrl });
        return NextResponse.json(slide, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
