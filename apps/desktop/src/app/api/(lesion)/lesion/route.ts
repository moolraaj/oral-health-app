

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import LesionModel from '@/models/Lesion';
import { ReusePaginationMethod } from '@/utils/Pagination';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        let {page,skip,limit}=ReusePaginationMethod(req)
        const lesions = await LesionModel.find().populate('submittedBy', 'name _id').skip(skip).limit(limit).exec();
        const totalLesions=await LesionModel.countDocuments()
        return NextResponse.json({
            message: 'Lesions retrieved successfully!',
            lesions,
            totalLesions,
            page,
            limit
        }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving lesions:', error);
        return NextResponse.json({ error: 'An error occurred while retrieving lesions.' }, { status: 500 });
    }
}
