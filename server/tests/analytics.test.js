const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('GET /api/analytics', () => {
  test('returns handover analytics', async () => {
    const response = await request(app)
      .get('/api/analytics')

    expect(response.status).toBe(200)

    expect(response.body).toHaveProperty(
      'handovers'
    )

    expect(response.body).toHaveProperty(
      'priority'
    )

    expect(response.body).toHaveProperty(
      'categories'
    )

    expect(response.body).toHaveProperty(
      'updates'
    )

    expect(response.body).toHaveProperty(
      'acknowledgments'
    )

    expect(
      response.body.handovers
    ).toHaveProperty('total')

    expect(
      response.body.handovers
    ).toHaveProperty('open')

    expect(
      response.body.handovers
    ).toHaveProperty('in_progress')

    expect(
      response.body.handovers
    ).toHaveProperty('closed')

    expect(
      response.body.priority
    ).toHaveProperty('high')

    expect(
      response.body.priority
    ).toHaveProperty('normal')

    expect(
      response.body.priority
    ).toHaveProperty('low')
  })

  test('total handovers matches database count', async () => {
    const databaseResult =
      await db('handovers')
        .count('* as count')
        .first()

    const response = await request(app)
      .get('/api/analytics')

    expect(
      response.body.handovers.total
    ).toBe(
      Number(databaseResult.count)
    )
  })
})

afterAll(async () => {
  await db.destroy()
})