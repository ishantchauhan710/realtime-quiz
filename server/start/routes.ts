import router from '@adonisjs/core/services/router'
import JwtMiddleware from '#middleware/jwt_middleware'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'

const jwt = new JwtMiddleware()

router.get('/', () => {
  return { hello: 'world' }
})

router.group(() => {
  router.post('/register', '#controllers/auth_controller.register')
  router.post('/login', '#controllers/auth_controller.login')
  router.post('/refresh', '#controllers/auth_controller.refresh')
  router.get('/auth/google', '#controllers/oauth_controller.redirect')
  router.get('/auth/google/callback', '#controllers/oauth_controller.callback')
})

router.group(() => {
  router.post('/logout', '#controllers/auth_controller.logout')
  router.get('/me', '#controllers/auth_controller.me')
  router.put('/profile', '#controllers/auth_controller.updateProfile')
  router.post('/profile/avatar', '#controllers/auth_controller.uploadAvatar')
}).use(jwt.handle)

router.get('/uploads/*', async ({ params, response }) => {
  const filePath = join(
    app.makePath('tmp/uploads'),
    ...params['*']
  )

  return response.download(filePath)
})