import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserDocument extends Document {
  username: string
  email: string
  password: string
  createdAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true, minlength: 3, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', async function () {
  const user = this as UserDocument
  if (!user.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(user.password, salt)
  user.password = hash
})

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema)
export default User


