const express = require('express')

const router = express.Router()

router.get('/user', (req, res) => {
  const personnelId = req.cookies.personnel_id

  if (!personnelId) {
    return res.status(200).json({
      personnel_id: null,
    })
  }

  res.status(200).json({
    personnel_id: Number(personnelId),
  })
})

router.post('/user', (req, res) => {
  const { personnel_id } = req.body

  if (!personnel_id) {
    return res.status(400).json({
      message: 'Personnel ID is required',
    })
  }

  res.cookie('personnel_id', personnel_id, {
    httpOnly: true,
    sameSite: 'lax',
  })

  res.status(200).json({
    personnel_id,
  })
})

router.delete('/user', (req, res) => {
  res.clearCookie('personnel_id')

  res.status(200).json({
    message: 'Selected user cleared',
  })
})

module.exports = router