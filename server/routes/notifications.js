const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { personnel_id } = req.query

    let query = db('notifications')
      .orderBy('created_at', 'desc')

    if (personnel_id) {
      query = query.where({
        personnel_id,
      })
    }

    const notifications = await query

    res.status(200).json(notifications)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve notifications',
    })
  }
})

router.post('/', async (req, res) => {
  const {
    personnel_id,
    handover_id,
    type,
    title,
    message,
  } = req.body

  if (
    !personnel_id ||
    !type ||
    !title ||
    !message
  ) {
    return res.status(400).json({
      message:
        'Personnel ID, type, title, and message are required',
    })
  }

  try {
    const [notification] = await db('notifications')
      .insert({
        personnel_id,
        handover_id: handover_id || null,
        type,
        title,
        message,
      })
      .returning('*')

    res.status(201).json(notification)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to create notification',
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const existingNotification =
      await db('notifications')
        .where({ id: req.params.id })
        .first()

    if (!existingNotification) {
      return res.status(404).json({
        message: 'Notification not found',
      })
    }

    const [notification] =
      await db('notifications')
        .where({ id: req.params.id })
        .update(req.body)
        .returning('*')

    res.status(200).json(notification)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to update notification',
    })
  }
})

router.patch('/personnel/:personnelId/read-all', async (req, res) => {
  try {
    await db('notifications')
      .where({
        personnel_id: req.params.personnelId,
      })
      .update({
        is_read: true,
      })

    res.status(200).json({
      message: 'Notifications marked as read',
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to update notifications',
    })
  }
})

router.delete('/personnel/:personnelId/read', async (req, res) => {
  try {
    const deleted = await db('notifications')
      .where({
        personnel_id: req.params.personnelId,
        is_read: true,
      })
      .del()

    res.status(200).json({
      message: 'Read notifications cleared',
      deleted,
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to clear notifications',
    })
  }
})

module.exports = router