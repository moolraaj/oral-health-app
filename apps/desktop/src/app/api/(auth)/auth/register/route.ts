 
import { dbConnect } from '@/database/database';
import User from '@/models/User';
import VerificationToken from '@/models/VerificationToken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendApprovalEmail } from '@/utils/Email';
 

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phoneNumber, role } = await req.json();

    // Check required fields
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'Name, email, password, and phone number are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check for duplicate email or phone number
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'User with this phone number already exists.' },
        { status: 409 }
      );
    }

    const finalRole = role || 'user';

    let status = 'approved';
    if (finalRole === 'admin' || finalRole === 'ambassador') {
      status = 'pending';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: finalRole,
      status,
    });

    // ✅ Newly Added logic (send email if role is admin/ambassador)
    if (status === 'pending') {
      const token = crypto.randomBytes(32).toString('hex');

      await VerificationToken.create({
        userId: newUser._id,
        token,
        createdAt: new Date(),
      });

     
    

      await sendApprovalEmail( newUser, token);
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: Number(newUser.phoneNumber),
          role: newUser.role,
          status: newUser.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
