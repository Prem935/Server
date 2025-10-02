import { Router, Response } from 'express'
import { validationResult } from 'express-validator'
import Task from '../models/Task.js'
import { auth, AuthRequest } from '../middleware/auth.js'
import { taskCreateValidator, taskUpdateValidator, taskQueryValidator } from '../utils/validators.js'

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TaskCreateRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in-progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get user tasks with optional filtering
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in-progress, completed]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, taskQueryValidator, async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { q, status, priority } = req.query as { q?: string; status?: string; priority?: string }
  const filter: any = { userId: req.user?.id }
  if (status) filter.status = status
  if (priority) filter.priority = priority
  let query = Task.find(filter).sort({ createdAt: -1 })
  if (q) query = query.find({ title: { $regex: q, $options: 'i' } }) // search only in the title
  const tasks = await query.exec()
  res.json(tasks.map(t => ({ id: t.id, title: t.title, description: t.description, status: t.status, priority: t.priority, createdAt: t.createdAt, updatedAt: t.updatedAt })))
})

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, taskCreateValidator, async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { title, description, status, priority } = req.body as { title: string; description?: string; status?: string; priority?: string }
  const task = await Task.create({ title, description, status, priority, userId: req.user?.id })
  res.status(201).json({ id: task.id, title: task.title, description: task.description, status: task.status, priority: task.priority, createdAt: task.createdAt, updatedAt: task.updatedAt })
})

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put('/:id', auth, taskUpdateValidator, async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  const updates: any = {}
  if (req.body.title !== undefined) updates.title = req.body.title
  if (req.body.description !== undefined) updates.description = req.body.description
  if (req.body.status !== undefined) updates.status = req.body.status
  if (req.body.priority !== undefined) updates.priority = req.body.priority
  const task = await Task.findOneAndUpdate({ _id: id, userId: req.user?.id }, updates, { new: true })
  if (!task) return res.status(404).json({ message: 'Task not found' })
  res.json({ id: task.id, title: task.title, description: task.description, status: task.status, priority: task.priority, createdAt: task.createdAt, updatedAt: task.updatedAt })
})

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const removed = await Task.findOneAndDelete({ _id: id, userId: req.user?.id })
  if (!removed) return res.status(404).json({ message: 'Task not found' })
  res.json({ success: true })
})

export default router



