import { dbConnect } from "@/database/database";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate required fields.
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Ensure the email is exactly that of the super-admin.
    if (email !== "superadmin@gmail.com") {
      return NextResponse.json(
        { error: "Invalid super-admin credentials." },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find the user by email.
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No super-admin found with that email." },
        { status: 409 }
      );
    }

    // Ensure the user's role is super-admin.
    if (user.role !== "super-admin") {
      return NextResponse.json(
        { error: "Not a super-admin account." },
        { status: 403 }
      );
    }

    // Validate password using bcrypt.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    // Super-admin login successful (status is assumed to be "approved").
    return NextResponse.json(
      {
        message: "Super-admin login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,  
          status: user.status,  
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
