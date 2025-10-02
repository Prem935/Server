import mongoose from 'mongoose'

export async function connect(): Promise<void> {
  const uri = process.env.MONGODB_URI || ''
  if (!uri) throw new Error('MONGODB_URI missing')
  const dbName = process.env.MONGODB_DB_NAME || 'intern_tasks'
  await mongoose.connect(uri, { dbName })
}



