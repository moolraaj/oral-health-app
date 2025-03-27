import { dbConnect } from "@/database/database";
import HomeSlide from "@/models/Slider";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const results = await HomeSlide.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'slides retrieved successfully', results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}