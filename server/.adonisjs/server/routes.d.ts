import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'oauth.redirect': { paramsTuple?: []; params?: {} }
    'oauth.callback': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'auth.upload_avatar': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create_solo': { paramsTuple?: []; params?: {} }
    'session.answer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create_multiplayer': { paramsTuple?: []; params?: {} }
    'session.join_multiplayer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'oauth.redirect': { paramsTuple?: []; params?: {} }
    'oauth.callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'oauth.redirect': { paramsTuple?: []; params?: {} }
    'oauth.callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.upload_avatar': { paramsTuple?: []; params?: {} }
    'session.create_solo': { paramsTuple?: []; params?: {} }
    'session.answer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create_multiplayer': { paramsTuple?: []; params?: {} }
    'session.join_multiplayer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}