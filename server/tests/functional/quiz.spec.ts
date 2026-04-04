import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Session Gameplay', (group) => {

    group.each.setup(async () => {
        await testUtils.db().truncate()
    })

    // Create solo session
    test('create solo session', async ({ client }) => {
        const email = `test${Date.now()}@mail.com`

        await client.post('/register').json({
            email,
            password: '123456',
            name: 'Test'
        })

        const login: any = await client.post('/login').json({
            email,
            password: '123456'
        })

        const token = login.body().accessToken

        const res = await client
            .post('/sessions/solo')
            .header('Authorization', `Bearer ${token}`)
            .json({ quizId: 1 })

        res.assertStatus(201)
    })

    // Get question
    test('get current question', async ({ client }) => {
        const email = `test${Date.now()}@mail.com`

        await client.post('/register').json({
            email,
            password: '123456',
            name: 'Test'
        })

        const login: any = await client.post('/login').json({
            email,
            password: '123456'
        })

        const token = login.body().accessToken

        const session: any = await client
            .post('/sessions/solo')
            .header('Authorization', `Bearer ${token}`)
            .json({ quizId: 1 })

        const sessionId = session.body().sessionId

        const res = await client
            .get(`/sessions/${sessionId}/question`)
            .header('Authorization', `Bearer ${token}`)

        res.assertStatus(200)
    })

    // Submit answer
    test('submit answer', async ({ client }) => {
        const email = `test${Date.now()}@mail.com`

        await client.post('/register').json({
            email,
            password: '123456',
            name: 'Test'
        })

        const login: any = await client.post('/login').json({
            email,
            password: '123456'
        })

        const token = login.body().accessToken

        const session: any = await client
            .post('/sessions/solo')
            .header('Authorization', `Bearer ${token}`)
            .json({ quizId: 1 })

        const sessionId = session.body().sessionId

        const res = await client
            .post(`/sessions/${sessionId}/answer`)
            .header('Authorization', `Bearer ${token}`)
            .json({ selectedOption: 0 })

        res.assertStatus(200)
    })

    // Get result
    test('get session state', async ({ client }) => {
        const email = `test${Date.now()}@mail.com`

        await client.post('/register').json({
            email,
            password: '123456',
            name: 'Test'
        })

        const login: any = await client.post('/login').json({
            email,
            password: '123456'
        })

        const token = login.body().accessToken

        const session: any = await client
            .post('/sessions/solo')
            .header('Authorization', `Bearer ${token}`)
            .json({ quizId: 1 })

        const sessionId = session.body().sessionId

        const res = await client
            .get(`/sessions/${sessionId}`)
            .header('Authorization', `Bearer ${token}`)

        res.assertStatus(200)
    })

    // Prevent unauthorized access
    test('cannot access session without token', async ({ client }) => {
        const res = await client.get('/sessions/1/question')

        res.assertStatus(401)
    })

})