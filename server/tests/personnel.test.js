const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/personnel', () => {
  test('returns a list of personnel', async () => {
    const response = await request(app)
      .get('/api/personnel')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('rank')
    expect(response.body[0]).toHaveProperty('role')
  })
})

describe('GET /api/personnel/:id', () => {
  test('returns one person by id', async () => {
    const existingPerson = await db('personnel').first()

    const response = await request(app)
      .get(`/api/personnel/${existingPerson.id}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(existingPerson.id)
  })

  test('returns 404 when personnel does not exist', async () => {
    const response = await request(app)
      .get('/api/personnel/999999')

    expect(response.status).toBe(404)
  })
})

describe('POST /api/personnel', () => {
  test('creates new personnel', async () => {
    const response = await request(app)
      .post('/api/personnel')
      .send({
        name: 'Test Planner',
        rank: 'Sgt',
        role: 'Wideband Planner',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test Planner')

    await db('personnel')
      .where({ id: response.body.id })
      .del()
  })

  test('returns 400 when name is missing', async () => {
    const response = await request(app)
      .post('/api/personnel')
      .send({
        rank: 'Sgt',
        role: 'Wideband Planner',
      })

    expect(response.status).toBe(400)
  })
})

describe('PATCH /api/personnel/:id', () => {
  test('updates personnel', async () => {
    const [person] = await db('personnel')
      .insert({
        name: 'Temporary Planner',
        rank: 'Sgt',
        role: 'Wideband Planner',
      })
      .returning('*')

    const response = await request(app)
      .patch(`/api/personnel/${person.id}`)
      .send({
        role: 'Lead Planner',
      })

    expect(response.status).toBe(200)
    expect(response.body.role).toBe('Lead Planner')

    await db('personnel')
      .where({ id: person.id })
      .del()
  })
})

describe('DELETE /api/personnel/:id', () => {
  test('deletes personnel', async () => {
    const [person] = await db('personnel')
      .insert({
        name: 'Delete Test Planner',
        rank: 'Sgt',
        role: 'Wideband Planner',
      })
      .returning('*')

    const response = await request(app)
      .delete(`/api/personnel/${person.id}`)

    expect(response.status).toBe(200)
  })

  test('returns 404 when personnel does not exist', async () => {
    const response = await request(app)
      .delete('/api/personnel/999999')

    expect(response.status).toBe(404)
  })
})

afterAll(async () => {
  await db.destroy()
})