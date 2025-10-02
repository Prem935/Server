import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface TaskDocument extends Document {
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

TaskSchema.index({ userId: 1, createdAt: -1 })
TaskSchema.index({ userId: 1, status: 1 })
TaskSchema.index({ userId: 1, priority: 1 })
TaskSchema.index({ userId: 1, title: 'text', description: 'text' })

const Task: Model<TaskDocument> = mongoose.models.Task || mongoose.model<TaskDocument>('Task', TaskSchema)
export default Task



