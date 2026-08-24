const express = require('express')
const db = require('../db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const personnel = await db('personnel')
      .orderBy('name', 'asc')

    res.status(200).json(personnel)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve personnel',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const person = await db('personnel')
      .where({ id: req.params.id })
      .first()

    if (!person) {
      return res.status(404).json({
        message: 'Personnel not found',
      })
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to retrieve personnel',
    })
  }
})

router.post('/', async (req, res) => {
  const { name, rank, role } = req.body

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
    })
  }

  try {
    const [newPerson] = await db('personnel')
      .insert({
        name,
        rank,
        role,
      })
      .returning('*')

    res.status(201).json(newPerson)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to create personnel',
    })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const existingPerson = await db('personnel')
      .where({ id: req.params.id })
      .first()

    if (!existingPerson) {
      return res.status(404).json({
        message: 'Personnel not found',
      })
    }

    const [updatedPerson] = await db('personnel')
      .where({ id: req.params.id })
      .update(req.body)
      .returning('*')

    res.status(200).json(updatedPerson)
  } catch (error) {
    res.status(503).json({
      message: 'Unable to update personnel',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('personnel')
      .where({ id: req.params.id })
      .del()

    if (!deleted) {
      return res.status(404).json({
        message: 'Personnel not found',
      })
    }

    res.status(200).json({
      message: 'Personnel deleted',
    })
  } catch (error) {
    res.status(503).json({
      message: 'Unable to delete personnel',
    })
  }
})

module.exports = router