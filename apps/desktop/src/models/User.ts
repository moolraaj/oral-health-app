import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phoneNumber: string
  role: 'user' | 'admin' | 'ambassador'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    phoneNumber: { type: String, required: [true, 'Phone number is required'] },
    role: { type: String, enum: ['user', 'admin', 'ambassador'], default: 'user' },
  },
  { timestamps: true }
)

const User: Model<IUser> = models.users || mongoose.model<IUser>('users', userSchema)
export default User
