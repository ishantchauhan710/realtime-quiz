import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'

router.get('/', () => {
  return { hello: 'world' }
})

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])