const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const updates = await db('updates')
      .orderBy('created_at', 'desc')

    res.status(200).json(updates)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve updates',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const update = await db('updates')
      .where({ id: req.params.id })
      .first()

    if (!update) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    res.status(200).json(update)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve update',
    })
  }
})

router.post('/', async (req, res) => {
  const {
    handover_id,
    personnel_id,
    message,
  } = req.body

  if (!handover_id || !message) {
    return res.status(400).json({
      message: 'Handover ID and message are required',
    })
  }

  try {
    const [newUpdate] = await db('updates')
      .insert({
        handover_id,
        personnel_id,
        message,
      })
      .returning('*')

    res.status(201).json(newUpdate)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to create update',
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const existingUpdate = await db('updates')
      .where({ id: req.params.id })
      .first()

    if (!existingUpdate) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    const [updatedUpdate] = await db('updates')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*')

    res.status(200).json(updatedUpdate)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to update update',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('updates')
      .where({ id: req.params.id })
      .del()

    if (!deleted) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    res.status(200).json({
      message: 'Update deleted',
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to delete update',
    })
  }
})

module.exports = router