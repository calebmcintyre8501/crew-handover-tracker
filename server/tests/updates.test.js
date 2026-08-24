const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/updates', () => {
  test('returns a list of updates', async () => {
    const response = await request(app)
      .get('/api/updates')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('handover_id')
    expect(response.body[0]).toHaveProperty('personnel_id')
    expect(response.body[0]).toHaveProperty('message')
  })
})

describe('GET /api/updates/:id', () => {
  test('returns one update by id', async () => {
    const existingUpdate = await db('updates').first()

    const response = await request(app)
      .get(`/api/updates/${existingUpdate.id}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(existingUpdate.id)
  })

  test('returns 404 when update does not exist', async () => {
    const response = await request(app)
      .get('/api/updates/999999')

    expect(response.status).toBe(404)
  })
})

describe('POST /api/updates', () => {
  test('creates a new update', async () => {
    const handover = await db('handovers').first()
    const person = await db('personnel').first()

    const response = await request(app)
      .post('/api/updates')
      .send({
        handover_id: handover.id,
        personnel_id: person.id,
        message: 'Test update for the current handover.',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.handover_id).toBe(handover.id)
    expect(response.body.personnel_id).toBe(person.id)

    await db('updates')
      .where({ id: response.body.id })
      .del()
  })

  test('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/updates')
      .send({
        personnel_id: 1,
      })

    expect(response.status).toBe(400)
  })
})

describe('PATCH /api/updates/:id', () => {
  test('updates an existing update', async () => {
    const handover = await db('handovers').first()
    const person = await db('personnel').first()

    const [update] = await db('updates')
      .insert({
        handover_id: handover.id,
        personnel_id: person.id,
        message: 'Original update message.',
      })
      .returning('*')

    const response = await request(app)
      .patch(`/api/updates/${update.id}`)
      .send({
        message: 'Updated update message.',
      })

    expect(response.status).toBe(200)
    expect(response.body.message)
      .toBe('Updated update message.')

    await db('updates')
      .where({ id: update.id })
      .del()
  })

  test('returns 404 when update does not exist', async () => {
    const response = await request(app)
      .patch('/api/updates/999999')
      .send({
        message: 'This should not work.',
      })

    expect(response.status).toBe(404)
  })
})

describe('DELETE /api/updates/:id', () => {
  test('deletes an existing update', async () => {
    const handover = await db('handovers').first()
    const person = await db('personnel').first()

    const [update] = await db('updates')
      .insert({
        handover_id: handover.id,
        personnel_id: person.id,
        message: 'Temporary update for delete test.',
      })
      .returning('*')

    const response = await request(app)
      .delete(`/api/updates/${update.id}`)

    expect(response.status).toBe(200)
  })

  test('returns 404 when update does not exist', async () => {
    const response = await request(app)
      .delete('/api/updates/999999')

    expect(response.status).toBe(404)
  })
})

afterAll(async () => {
  await db.destroy()
})