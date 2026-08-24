const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('Session user cookie', () => {
  test('returns null when no user cookie exists', async () => {
    const response = await request(app)
      .get('/api/session/user')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      personnel_id: null,
    })
  })

  test('stores selected personnel in a cookie', async () => {
    const person = await db('personnel').first()

    const response = await request(app)
      .post('/api/session/user')
      .send({
        personnel_id: person.id,
      })

    expect(response.status).toBe(200)
    expect(response.body.personnel_id).toBe(person.id)
    expect(response.headers['set-cookie']).toBeDefined()
  })

  test('returns 400 when personnel id is missing', async () => {
    const response = await request(app)
      .post('/api/session/user')
      .send({})

    expect(response.status).toBe(400)
  })

  test('remembers selected user with cookie', async () => {
    const person = await db('personnel').first()
    const agent = request.agent(app)

    await agent
      .post('/api/session/user')
      .send({
        personnel_id: person.id,
      })

    const response = await agent
      .get('/api/session/user')

    expect(response.status).toBe(200)
    expect(response.body.personnel_id).toBe(person.id)
  })

  test('clears selected user cookie', async () => {
    const person = await db('personnel').first()
    const agent = request.agent(app)

    await agent
      .post('/api/session/user')
      .send({
        personnel_id: person.id,
      })

    const deleteResponse = await agent
      .delete('/api/session/user')

    expect(deleteResponse.status).toBe(200)

    const getResponse = await agent
      .get('/api/session/user')

    expect(getResponse.body.personnel_id).toBeNull()
  })
})

afterAll(async () => {
  await db.destroy()
})