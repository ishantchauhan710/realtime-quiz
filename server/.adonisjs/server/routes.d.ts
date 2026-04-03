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
    'quizzes.store': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quizzes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'quizzes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.create_solo': { paramsTuple?: []; params?: {} }
    'session.get_question': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.submit_answer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.get_result': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'oauth.redirect': { paramsTuple?: []; params?: {} }
    'oauth.callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.get_question': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.get_result': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'oauth.redirect': { paramsTuple?: []; params?: {} }
    'oauth.callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'quizzes.index': { paramsTuple?: []; params?: {} }
    'quizzes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.get_question': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.get_result': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.upload_avatar': { paramsTuple?: []; params?: {} }
    'quizzes.store': { paramsTuple?: []; params?: {} }
    'session.create_solo': { paramsTuple?: []; params?: {} }
    'session.submit_answer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'quizzes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'quizzes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}