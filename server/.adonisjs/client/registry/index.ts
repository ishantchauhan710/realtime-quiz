/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.refresh': {
    methods: ["POST"],
    pattern: '/refresh',
    tokens: [{"old":"/refresh","type":0,"val":"refresh","end":""}],
    types: placeholder as Registry['auth.refresh']['types'],
  },
  'oauth.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/auth/google',
    tokens: [{"old":"/auth/google","type":0,"val":"auth","end":""},{"old":"/auth/google","type":0,"val":"google","end":""}],
    types: placeholder as Registry['oauth.redirect']['types'],
  },
  'oauth.callback': {
    methods: ["GET","HEAD"],
    pattern: '/auth/google/callback',
    tokens: [{"old":"/auth/google/callback","type":0,"val":"auth","end":""},{"old":"/auth/google/callback","type":0,"val":"google","end":""},{"old":"/auth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['oauth.callback']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/me',
    tokens: [{"old":"/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.update_profile': {
    methods: ["PUT"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['auth.update_profile']['types'],
  },
  'auth.upload_avatar': {
    methods: ["POST"],
    pattern: '/profile/avatar',
    tokens: [{"old":"/profile/avatar","type":0,"val":"profile","end":""},{"old":"/profile/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['auth.upload_avatar']['types'],
  },
  'quizzes.index': {
    methods: ["GET","HEAD"],
    pattern: '/quizzes',
    tokens: [{"old":"/quizzes","type":0,"val":"quizzes","end":""}],
    types: placeholder as Registry['quizzes.index']['types'],
  },
  'quizzes.show': {
    methods: ["GET","HEAD"],
    pattern: '/quizzes/:id',
    tokens: [{"old":"/quizzes/:id","type":0,"val":"quizzes","end":""},{"old":"/quizzes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['quizzes.show']['types'],
  },
  'session.create_solo': {
    methods: ["POST"],
    pattern: '/sessions/solo',
    tokens: [{"old":"/sessions/solo","type":0,"val":"sessions","end":""},{"old":"/sessions/solo","type":0,"val":"solo","end":""}],
    types: placeholder as Registry['session.create_solo']['types'],
  },
  'session.answer': {
    methods: ["POST"],
    pattern: '/sessions/:id/answer',
    tokens: [{"old":"/sessions/:id/answer","type":0,"val":"sessions","end":""},{"old":"/sessions/:id/answer","type":1,"val":"id","end":""},{"old":"/sessions/:id/answer","type":0,"val":"answer","end":""}],
    types: placeholder as Registry['session.answer']['types'],
  },
  'session.create_multiplayer': {
    methods: ["POST"],
    pattern: '/sessions/multiplayer',
    tokens: [{"old":"/sessions/multiplayer","type":0,"val":"sessions","end":""},{"old":"/sessions/multiplayer","type":0,"val":"multiplayer","end":""}],
    types: placeholder as Registry['session.create_multiplayer']['types'],
  },
  'session.join_multiplayer': {
    methods: ["POST"],
    pattern: '/sessions/:id/join',
    tokens: [{"old":"/sessions/:id/join","type":0,"val":"sessions","end":""},{"old":"/sessions/:id/join","type":1,"val":"id","end":""},{"old":"/sessions/:id/join","type":0,"val":"join","end":""}],
    types: placeholder as Registry['session.join_multiplayer']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
