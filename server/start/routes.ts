import router from '@adonisjs/core/services/router'
import JwtMiddleware from '#middleware/jwt_middleware'

router.get('/', () => {
  return { hello: 'world' }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')
router.post('/refresh', '#controllers/auth_controller.refresh')
router.post('/logout', '#controllers/auth_controller.logout')
router.get('/me', '#controllers/auth_controller.me').use(new JwtMiddleware().handle)