const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/notifications', () => {
  test('returns notifications for personnel', async () => {
    const person = await db('personnel').first()

    const response = await request(app)
      .get(`/api/notifications?personnel_id=${person.id}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('POST /api/notifications', () => {
  test('creates a notification', async () => {
    const person = await db('personnel').first()
    const handover = await db('handovers').first()

    const response = await request(app)
      .post('/api/notifications')
      .send({
        personnel_id: person.id,
        handover_id: handover.id,
        type: 'directed',
        title: 'Handover Directed to You',
        message: handover.title,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.personnel_id).toBe(person.id)
    expect(response.body.is_read).toBe(false)

    await db('notifications')
      .where({ id: response.body.id })
      .del()
  })

  test('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/notifications')
      .send({
        type: 'directed',
      })

    expect(response.status).toBe(400)
  })
})

describe('PATCH /api/notifications/:id', () => {
  test('marks one notification as read', async () => {
    const person = await db('personnel').first()

    const [notification] = await db('notifications')
      .insert({
        personnel_id: person.id,
        type: 'high_priority',
        title: 'High Priority Handover',
        message: 'Test notification',
      })
      .returning('*')

    const response = await request(app)
      .patch(`/api/notifications/${notification.id}`)
      .send({
        is_read: true,
      })

    expect(response.status).toBe(200)
    expect(response.body.is_read).toBe(true)

    await db('notifications')
      .where({ id: notification.id })
      .del()
  })
})

describe('PATCH /api/notifications/personnel/:personnelId/read-all', () => {
  test('marks all notifications as read', async () => {
    const person = await db('personnel').first()

    await db('notifications')
      .insert([
        {
          personnel_id: person.id,
          type: 'directed',
          title: 'Notification One',
          message: 'Test',
        },
        {
          personnel_id: person.id,
          type: 'new_update',
          title: 'Notification Two',
          message: 'Test',
        },
      ])

    const response = await request(app)
      .patch(
        `/api/notifications/personnel/${person.id}/read-all`
      )

    expect(response.status).toBe(200)

    const unread = await db('notifications')
      .where({
        personnel_id: person.id,
        is_read: false,
      })

    expect(unread.length).toBe(0)

    await db('notifications')
      .where({ personnel_id: person.id })
      .del()
  })
})

describe('DELETE /api/notifications/personnel/:personnelId/read', () => {
  test('clears read notifications', async () => {
    const person = await db('personnel').first()

    await db('notifications')
      .insert({
        personnel_id: person.id,
        type: 'directed',
        title: 'Read Notification',
        message: 'Test',
        is_read: true,
      })

    const response = await request(app)
      .delete(
        `/api/notifications/personnel/${person.id}/read`
      )

    expect(response.status).toBe(200)

    const remaining = await db('notifications')
      .where({
        personnel_id: person.id,
        is_read: true,
      })

    expect(remaining.length).toBe(0)
  })
})

afterAll(async () => {
  await db.destroy()
})