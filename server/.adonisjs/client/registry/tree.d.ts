/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    refresh: typeof routes['auth.refresh']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
    updateProfile: typeof routes['auth.update_profile']
    uploadAvatar: typeof routes['auth.upload_avatar']
  }
  oauth: {
    redirect: typeof routes['oauth.redirect']
    callback: typeof routes['oauth.callback']
  }
  quizzes: {
    store: typeof routes['quizzes.store']
    index: typeof routes['quizzes.index']
    show: typeof routes['quizzes.show']
    update: typeof routes['quizzes.update']
    destroy: typeof routes['quizzes.destroy']
  }
}
