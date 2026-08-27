const express = require('express')
const router = express.Router()
const db = require('../db')


// GET all updates

router.get('/', async (req, res) => {
  try {
    const updates = await db('updates')
      .select('*')
      .orderBy('created_at', 'asc')

    res.status(200).json(updates)
  } catch (error) {
    console.error(
      'Error retrieving updates:',
      error
    )

    res.status(500).json({
      message: 'Unable to retrieve updates',
    })
  }
})


// GET one update by ID

router.get('/:id', async (req, res) => {
  try {
    const update = await db('updates')
      .where({
        id: req.params.id,
      })
      .first()

    if (!update) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    res.status(200).json(update)
  } catch (error) {
    console.error(
      'Error retrieving update:',
      error
    )

    res.status(500).json({
      message: 'Unable to retrieve update',
    })
  }
})


// POST a new update

router.post('/', async (req, res) => {
  const {
    handover_id,
    personnel_id,
    message,
  } = req.body

  if (
    !handover_id ||
    !personnel_id ||
    !message?.trim()
  ) {
    return res.status(400).json({
      message:
        'handover_id, personnel_id, and message are required',
    })
  }

  try {
    const handover = await db('handovers')
      .where({
        id: handover_id,
      })
      .first()

    if (!handover) {
      return res.status(404).json({
        message: 'Handover not found',
      })
    }

    const author = await db('personnel')
      .where({
        id: personnel_id,
      })
      .first()

    if (!author) {
      return res.status(404).json({
        message: 'Personnel not found',
      })
    }

    const [newUpdate] = await db('updates')
      .insert({
        handover_id,
        personnel_id,
        message: message.trim(),
      })
      .returning('*')

    const acknowledgments = await db(
      'acknowledgments'
    ).where({
      handover_id,
    })

    const recipientIds = new Set()

    /*
      Notify the person the handover
      is specifically directed to.
    */

    if (handover.attention_for) {
      recipientIds.add(
        Number(handover.attention_for)
      )
    }

    /*
      Notify everyone who has
      acknowledged the handover.
    */

    acknowledgments.forEach(
      (acknowledgment) => {
        recipientIds.add(
          Number(
            acknowledgment.personnel_id
          )
        )
      }
    )

    /*
      Do not notify the person who
      created the update.
    */

    recipientIds.delete(
      Number(personnel_id)
    )

    /*
      Because recipientIds is a Set,
      someone who is both directed
      and acknowledged only gets
      one notification.
    */

    if (recipientIds.size > 0) {
      const notificationRows =
        Array.from(recipientIds).map(
          (recipientId) => ({
            personnel_id: recipientId,
            handover_id,
            type: 'new_update',
            title: 'New Handover Update',
            message:
              `${author.rank} ${author.name} added an update to "${handover.title}".`,
            is_read: false,
          })
        )

      await db('notifications').insert(
        notificationRows
      )
    }

    res.status(201).json(newUpdate)
  } catch (error) {
    console.error(
      'Error creating update:',
      error
    )

    res.status(500).json({
      message: 'Unable to create update',
    })
  }
})


// PATCH an existing update

router.patch('/:id', async (req, res) => {
  try {
    const existingUpdate = await db(
      'updates'
    )
      .where({
        id: req.params.id,
      })
      .first()

    if (!existingUpdate) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    const [updated] = await db('updates')
      .where({
        id: req.params.id,
      })
      .update(req.body)
      .returning('*')

    res.status(200).json(updated)
  } catch (error) {
    console.error(
      'Error updating update:',
      error
    )

    res.status(500).json({
      message: 'Unable to update update',
    })
  }
})


// DELETE an update

router.delete('/:id', async (req, res) => {
  try {
    const existingUpdate = await db(
      'updates'
    )
      .where({
        id: req.params.id,
      })
      .first()

    if (!existingUpdate) {
      return res.status(404).json({
        message: 'Update not found',
      })
    }

    await db('updates')
      .where({
        id: req.params.id,
      })
      .del()

    res.status(200).json({
      message: 'Update deleted successfully',
    })
  } catch (error) {
    console.error(
      'Error deleting update:',
      error
    )

    res.status(500).json({
      message: 'Unable to delete update',
    })
  }
})


module.exports = router