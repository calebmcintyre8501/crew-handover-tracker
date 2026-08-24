const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/handovers', () => {
  test('returns a list of active handovers', async () => {
    const response = await request(app)
      .get('/api/handovers')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('title')
    expect(response.body[0]).toHaveProperty('description')
    expect(response.body[0]).toHaveProperty('category')
    expect(response.body[0]).toHaveProperty('priority')
    expect(response.body[0]).toHaveProperty('status')
  })

  test('filters handovers by priority', async () => {
    const response = await request(app)
      .get('/api/handovers?priority=high')

    expect(response.status).toBe(200)

    response.body.forEach((handover) => {
      expect(handover.priority).toBe('high')
    })
  })

  test('filters handovers by category', async () => {
    const response = await request(app)
      .get('/api/handovers?category=training')

    expect(response.status).toBe(200)

    response.body.forEach((handover) => {
      expect(handover.category).toBe('training')
    })
  })

  test('filters handovers by status', async () => {
    const response = await request(app)
      .get('/api/handovers?status=open')

    expect(response.status).toBe(200)

    response.body.forEach((handover) => {
      expect(handover.status).toBe('open')
    })
  })
})

describe('GET /api/handovers/:id', () => {
  test('returns one handover by id', async () => {
    const existingHandover = await db('handovers').first()

    const response = await request(app)
      .get(`/api/handovers/${existingHandover.id}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(existingHandover.id)
  })

  test('returns 404 when handover does not exist', async () => {
    const response = await request(app)
      .get('/api/handovers/999999')

    expect(response.status).toBe(404)
  })
})

describe('POST /api/handovers', () => {
  test('creates a new handover', async () => {
    const creator = await db('personnel').first()

    const response = await request(app)
      .post('/api/handovers')
      .send({
        title: 'Mission package requires update',
        description:
          'Mission package needs one final update before the next planning cycle.',
        category: 'mission_note',
        priority: 'normal',
        status: 'open',
        created_by: creator.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')

    await db('handovers')
      .where({ id: response.body.id })
      .del()
  })

  test('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/handovers')
      .send({
        priority: 'high',
      })

    expect(response.status).toBe(400)
  })
})

describe('PATCH /api/handovers/:id', () => {
  test('updates an existing handover', async () => {
    const creator = await db('personnel').first()

    const [handover] = await db('handovers')
      .insert({
        title: 'Patch Test Handover',
        description: 'Temporary handover for patch testing.',
        category: 'general',
        priority: 'normal',
        status: 'open',
        created_by: creator.id,
      })
      .returning('*')

    const response = await request(app)
      .patch(`/api/handovers/${handover.id}`)
      .send({
        priority: 'high',
        status: 'in_progress',
      })

    expect(response.status).toBe(200)
    expect(response.body.priority).toBe('high')
    expect(response.body.status).toBe('in_progress')

    await db('handovers')
      .where({ id: handover.id })
      .del()
  })
})

describe('DELETE /api/handovers/:id', () => {
  test('deletes an existing handover', async () => {
    const creator = await db('personnel').first()

    const [handover] = await db('handovers')
      .insert({
        title: 'Temporary handover',
        description: 'Delete test.',
        category: 'general',
        priority: 'normal',
        status: 'open',
        created_by: creator.id,
      })
      .returning('*')

    const response = await request(app)
      .delete(`/api/handovers/${handover.id}`)

    expect(response.status).toBe(200)
  })

  test('returns 404 when handover does not exist', async () => {
    const response = await request(app)
      .delete('/api/handovers/999999')

    expect(response.status).toBe(404)
  })
})

describe('GET /api/handovers/:id/updates', () => {
  test('returns all updates for a handover', async () => {
    const existingUpdate = await db('updates').first()

    const response = await request(app)
      .get(`/api/handovers/${existingUpdate.handover_id}/updates`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)

    response.body.forEach((update) => {
      expect(update.handover_id).toBe(existingUpdate.handover_id)
    })
  })

  test('returns 404 when handover does not exist', async () => {
    const response = await request(app)
      .get('/api/handovers/999999/updates')

    expect(response.status).toBe(404)
  })
})

afterAll(async () => {
  await db.destroy()
})