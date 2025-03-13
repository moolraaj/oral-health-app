


import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

 


// get single user
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: String }> }) {
  let id = (await params).id
  await dbConnect()
  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  const user = await User.findOne(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'User retrieved successfully', user: [user] });
}



// delete single user

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: String }> }) {
  let id = (await params).id
  await dbConnect()
  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await user.deleteOne()
  return NextResponse.json({ message: 'User deleted successfully' });
}


// update user

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let id = (await params).id;
  const body = await req.json();
  const { name, email, password, phoneNumber, role } = body;
  await dbConnect();
  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  const currentUser = await User.findById(id);
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const updateFields: { [key: string]: any } = {};
  if (name) updateFields.name = name;
  if (email && email !== currentUser.email) {

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
    }
    updateFields.email = email;
  }
  if (phoneNumber) updateFields.phoneNumber = phoneNumber;
  if (password) updateFields.password = name;

  if (role) updateFields.role = role;
  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: 'No fields to update provided or values are the same.' }, { status: 400 });
  }
  const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });
  return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
}



