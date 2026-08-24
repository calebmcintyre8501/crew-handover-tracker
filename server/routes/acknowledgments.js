const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const acknowledgments = await db('acknowledgments')
      .orderBy('acknowledged_at', 'desc')

    res.status(200).json(acknowledgments)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve acknowledgments',
    })
  }
})

router.post('/', async (req, res) => {
  const { handover_id, personnel_id } = req.body

  if (!handover_id || !personnel_id) {
    return res.status(400).json({
      message: 'Handover ID and personnel ID are required',
    })
  }

  try {
    const [acknowledgment] = await db('acknowledgments')
      .insert({
        handover_id,
        personnel_id,
      })
      .returning('*')

    res.status(201).json(acknowledgment)
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Handover already acknowledged by this person',
      })
    }

    res.status(503).json({
      message: 'Unable to acknowledge handover',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('acknowledgments')
      .where({ id: req.params.id })
      .del()

    if (!deleted) {
      return res.status(404).json({
        message: 'Acknowledgment not found',
      })
    }

    res.status(200).json({
      message: 'Acknowledgment deleted',
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to delete acknowledgment',
    })
  }
})

module.exports = router