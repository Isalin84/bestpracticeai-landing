import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import { getDb } from '../db/database.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const leadsRouter = Router()

const leadsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Слишком много заявок. Попробуйте через час или напишите напрямую.' },
})

leadsRouter.post('/', leadsLimiter, async (req, res) => {
  const { full_name, company, phone, message } = req.body

  if (!full_name || !phone) {
    res.status(400).json({ message: 'ФИО и телефон обязательны' })
    return
  }

  const db = getDb()
  const r = db.prepare('INSERT INTO leads (full_name,company,phone,message) VALUES (?,?,?,?)').run(full_name, company||null, phone, message||null)

  // Send email notification
  const settings = db.prepare('SELECT * FROM settings WHERE key IN (?,?)').all('notify_email', 'smtp_configured') as any[]
  const notifyEmail = settings.find((s: any) => s.key === 'notify_email')?.value

  if (notifyEmail && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: notifyEmail,
        subject: `Новая заявка с сайта — ${full_name}`,
        html: `
          <h2>Новая заявка с bestpracticeai.ru</h2>
          <p><b>ФИО:</b> ${full_name}</p>
          <p><b>Компания:</b> ${company || '—'}</p>
          <p><b>Телефон:</b> <a href="tel:${phone}">${phone}</a></p>
          <p><b>Запрос:</b><br>${message || '—'}</p>
          <hr>
          <p style="color:#999">Управление заявками: <a href="https://bestpracticeai.ru/admin/leads">admin панель</a></p>
        `,
      })
    } catch (e) {
      console.error('Email notification failed:', e)
    }
  }

  res.status(201).json({ message: 'Заявка принята', id: r.lastInsertRowid })
})

// Admin
leadsRouter.get('/admin/all', authMiddleware, (req, res) => {
  res.json(getDb().prepare('SELECT * FROM leads ORDER BY created_at DESC').all())
})

leadsRouter.put('/admin/:id', authMiddleware, (req, res) => {
  const { status } = req.body
  const db = getDb()
  db.prepare('UPDATE leads SET status=? WHERE id=?').run(status, req.params.id)
  res.json(db.prepare('SELECT * FROM leads WHERE id=?').get(req.params.id))
})
