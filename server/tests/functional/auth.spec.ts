import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth', (group) => {

  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  // Register user
  test('register user', async ({ client }) => {
    const res = await client.post('/register').json({
      email: `test${Date.now()}@mail.com`,
      password: '123456',
      name: 'Test User'
    })

    res.assertStatus(201)
  })

  // Fail register (missing fields)
  test('register fails with missing fields', async ({ client }) => {
    const res = await client.post('/register').json({})
    res.assertStatus(400)
  })

  // Login success
  test('login user', async ({ client }) => {
    const email = `test${Date.now()}@mail.com`

    await client.post('/register').json({
      email,
      password: '123456',
      name: 'Test User'
    })

    const res = await client.post('/login').json({
      email,
      password: '123456'
    })

    res.assertStatus(200)
    const body: any = res.body()

    if (!body.accessToken) {
      throw new Error('Access token missing')
    }

    if (!body.refreshToken) {
      throw new Error('Refresh token missing')
    }
  })

  // Login fail (wrong password)
  test('login fails with wrong password', async ({ client }) => {
    const email = `test${Date.now()}@mail.com`

    await client.post('/register').json({
      email,
      password: '123456',
      name: 'Test User'
    })

    const res = await client.post('/login').json({
      email,
      password: 'wrongpassword'
    })

    res.assertStatus(401)
  })

  // Get profile (protected route)
  test('get profile with token', async ({ client }) => {
    const email = `test${Date.now()}@mail.com`

    await client.post('/register').json({
      email,
      password: '123456',
      name: 'Test User'
    })

    const login: any = await client.post('/login').json({
      email,
      password: '123456'
    })

    const token = login.body().accessToken

    const res = await client
      .get('/me')
      .header('Authorization', `Bearer ${token}`)

    res.assertStatus(200)
    res.assertBodyContains({
      email
    })
  })

})