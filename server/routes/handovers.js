const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { priority, category, status } = req.query

    let query = db('handovers')

    if (priority) {
      query = query.where('priority', priority)
    }

    if (category) {
      query = query.where('category', category)
    }

    if (status) {
      query = query.where('status', status)
    } else {
      query = query.whereNot('status', 'closed')
    }

    const handovers = await query.orderBy('created_at', 'desc')

    res.status(200).json(handovers)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve handovers',
    })
  }
})

router.get('/:id/updates', async (req, res) => {
  try {
    const handover = await db('handovers')
      .where({ id: req.params.id })
      .first()

    if (!handover) {
      return res.status(404).json({
        message: 'Handover not found',
      })
    }

    const updates = await db('updates')
      .where({ handover_id: req.params.id })
      .orderBy('created_at', 'asc')

    res.status(200).json(updates)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve handover updates',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const handover = await db('handovers')
      .where({ id: req.params.id })
      .first()

    if (!handover) {
      return res.status(404).json({
        message: 'Handover not found',
      })
    }

    res.status(200).json(handover)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve handover',
    })
  }
})

router.post('/', async (req, res) => {
  const {
    title,
    description,
    category,
    priority,
    status,
    created_by,
    attention_for,
    due_date,
  } = req.body

  if (!title || !description || !category) {
    return res.status(400).json({
      message: 'Title, description, and category are required',
    })
  }

  try {
    const [newHandover] = await db('handovers')
      .insert({
        title,
        description,
        category,
        priority,
        status,
        created_by,
        attention_for,
        due_date,
      })
      .returning('*')

    res.status(201).json(newHandover)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to create handover',
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const existingHandover = await db('handovers')
      .where({ id: req.params.id })
      .first()

    if (!existingHandover) {
      return res.status(404).json({
        message: 'Handover not found',
      })
    }

    const [updatedHandover] = await db('handovers')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*')

    res.status(200).json(updatedHandover)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to update handover',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('handovers')
      .where({ id: req.params.id })
      .del()

    if (!deleted) {
      return res.status(404).json({
        message: 'Handover not found',
      })
    }

    res.status(200).json({
      message: 'Handover deleted',
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to delete handover',
    })
  }
})

module.exports = router