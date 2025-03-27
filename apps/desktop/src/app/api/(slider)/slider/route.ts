import { dbConnect } from '@/database/database';
import Slider from '@/models/Slider';
import { EN, KN } from '@/utils/Constants';
import { getLanguage } from '@/utils/FilterLanguages';
import { ReusePaginationMethod } from '@/utils/Pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const lang = getLanguage(request);  
    await dbConnect();

    const { page, skip, limit } = ReusePaginationMethod(request);
    const sliders = await Slider.find().limit(limit).skip(skip).lean();
    const totalResults = await Slider.countDocuments();

 
    const localizedData = sliders.map((slide: any) => {
      if (lang === EN || lang === KN) {
        return {
          _id: slide._id,
          sliderImage: slide.sliderImage,
          text: { [lang]: slide.text?.[lang] || "" },
          description: { [lang]: slide.description?.[lang] || "" },
          body: slide.body?.map((b: any) => ({
            image: b.image,
            text: { [lang]: b.text?.[lang] || "" },
            description: { [lang]: b.description?.[lang] || "" },
            _id: b._id
          })) || [],
          createdAt: slide.createdAt,
          updatedAt: slide.updatedAt,
          __v: slide.__v
        };
      } else {
       
        return slide
      }
    });
    

    return NextResponse.json({
      status: 200,
      success: true,
      result: localizedData,
      totalResults,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Failed to fetch sliders' }, { status: 500 });
  }
}

