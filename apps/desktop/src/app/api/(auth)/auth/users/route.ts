 
import { dbConnect } from '@/database/database'
import User from '@/models/User'
import { ReusePaginationMethod } from '@/utils/Pagination'
import { NextRequest, NextResponse } from 'next/server'
 
 

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

 
    const { page, limit, skip } = ReusePaginationMethod(req)

 
    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .exec()

 
    const totalUsers = await User.countDocuments()

 
    return NextResponse.json(
      {
        message: 'Users retrieved successfully',
        users,
        total: totalUsers,
        page,
        limit
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Server error while fetching users.' },
      { status: 500 }
    )
  }
}
