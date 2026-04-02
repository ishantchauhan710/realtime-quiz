import router from '@adonisjs/core/services/router'
import JwtMiddleware from '#middleware/jwt_middleware'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'

router.get('/', () => {
  return { hello: 'world' }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')
router.post('/refresh', '#controllers/auth_controller.refresh')
router.post('/logout', '#controllers/auth_controller.logout')
router.get('/me', '#controllers/auth_controller.me').use(new JwtMiddleware().handle)

router.get('/auth/google', '#controllers/oauth_controller.redirect')
router.get('/auth/google/callback', '#controllers/oauth_controller.callback')


router.get('/uploads/*', async ({ params, response }) => {
  const filePath = join(
    app.makePath('tmp/uploads'),
    ...params['*']
  )

  return response.download(filePath)
})


router.put('/profile', '#controllers/auth_controller.updateProfile')
  .use(new JwtMiddleware().handle)

router.post('/profile/avatar', '#controllers/auth_controller.uploadAvatar')
  .use(new JwtMiddleware().handle)