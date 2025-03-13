import { dbConnect } from '@/database/database'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
 
 

export async function POST(req: NextRequest) {
  try {
  
    const { name, email, password, phoneNumber, role } = await req.json()

 
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'Name, email, password, and phone number are required.' },
        { status: 400 }
      )
    }

 
    await dbConnect()

 
    const existingUserByEmail = await User.findOne({ email })
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      )
    }

  
    const existingUserByPhone = await User.findOne({ phoneNumber })
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'User with this phone number already exists.' },
        { status: 409 }
      )
    }

    
    const allowedRoles = ['user', 'admin', 'ambassador']
    let finalRole = 'user'  
    if (role && allowedRoles.includes(role)) {
      finalRole = role
    }

 
    const hashedPassword = await bcrypt.hash(password, 10)

 
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: finalRole,   
    })

 
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
