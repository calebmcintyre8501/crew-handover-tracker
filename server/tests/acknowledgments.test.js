const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/acknowledgments', () => {
  test('returns a list of acknowledgments', async () => {
    const response = await request(app)
      .get('/api/acknowledgments')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})

describe('POST /api/acknowledgments', () => {
  test('creates an acknowledgment', async () => {
    const handover = await db('handovers').first()
    const person = await db('personnel').first()

    await db('acknowledgments')
      .where({
        handover_id: handover.id,
        personnel_id: person.id,
      })
      .del()

    const response = await request(app)
      .post('/api/acknowledgments')
      .send({
        handover_id: handover.id,
        personnel_id: person.id,
      })

    expect(response.status).toBe(201)
    expect(response.body.handover_id).toBe(handover.id)
    expect(response.body.personnel_id).toBe(person.id)

    await db('acknowledgments')
      .where({ id: response.body.id })
      .del()
  })

  test('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/acknowledgments')
      .send({
        personnel_id: 1,
      })

    expect(response.status).toBe(400)
  })
})

describe('DELETE /api/acknowledgments/:id', () => {
  test('deletes an acknowledgment', async () => {
    const handover = await db('handovers').first()
    const person = await db('personnel').first()

    await db('acknowledgments')
      .where({
        handover_id: handover.id,
        personnel_id: person.id,
      })
      .del()

    const [acknowledgment] = await db('acknowledgments')
      .insert({
        handover_id: handover.id,
        personnel_id: person.id,
      })
      .returning('*')

    const response = await request(app)
      .delete(`/api/acknowledgments/${acknowledgment.id}`)

    expect(response.status).toBe(200)
  })

  test('returns 404 when acknowledgment does not exist', async () => {
    const response = await request(app)
      .delete('/api/acknowledgments/999999')

    expect(response.status).toBe(404)
  })
})

afterAll(async () => {
  await db.destroy()
})