const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  try {
    const [
      handovers,
      updatesResult,
      acknowledgmentsResult,
    ] = await Promise.all([
      db('handovers').select(
        'status',
        'priority',
        'category'
      ),

      db('updates')
        .count('* as count')
        .first(),

      db('acknowledgments')
        .count('* as count')
        .first(),
    ])

    const analytics = {
      handovers: {
        total: handovers.length,
        open: 0,
        in_progress: 0,
        closed: 0,
      },

      priority: {
        high: 0,
        normal: 0,
        low: 0,
      },

      categories: {
        mission_issue: 0,
        mission_note: 0,
        system_status: 0,
        personnel_note: 0,
        training: 0,
        priority_task: 0,
        general: 0,
      },

      updates: Number(
        updatesResult.count
      ),

      acknowledgments: Number(
        acknowledgmentsResult.count
      ),
    }

    handovers.forEach((handover) => {
      if (
        Object.hasOwn(
          analytics.handovers,
          handover.status
        )
      ) {
        analytics.handovers[
          handover.status
        ] += 1
      }

      if (
        Object.hasOwn(
          analytics.priority,
          handover.priority
        )
      ) {
        analytics.priority[
          handover.priority
        ] += 1
      }

      if (
        Object.hasOwn(
          analytics.categories,
          handover.category
        )
      ) {
        analytics.categories[
          handover.category
        ] += 1
      }
    })

    res.status(200).json(analytics)
  } catch (error) {
    console.error(
      'Error retrieving analytics:',
      error
    )

    res.status(500).json({
      message:
        'Unable to retrieve analytics',
    })
  }
})

module.exports = router