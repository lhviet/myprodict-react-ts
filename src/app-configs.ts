const HOST = {
  api: {
    getUrl: (path: string): string => (path === HOST.api.base ? path : (HOST.api.base + path)),
    // base: '//localhost:3001',
    base: 'http://ec2-13-125-199-18.ap-northeast-2.compute.amazonaws.com:3001',
    user: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      // signup_local: '/api/auth/signup-local',
      // reset_password: '/api/auth/reset-password',
      // verify_account: '/api/auth/verify-account',
      loadUser: '/api/user/load-user',
      loadUserBasic: '/api/user/load-user-basic',
      // support: '/api/auth/user-support-request',
      login_by_facebook: '/api/auth/login-by-facebook',
      connect_to_facebook: '/api/auth/connect-to-facebook',
      login_by_google: '/api/auth/login-by-google',
      connect_to_google: '/api/auth/connect-to-google',
    },
    // base: '//api.bibooki.com',
    word: {
      search: '/api/word/search',
      is_existing: '/api/word/is-word-existing/',
      is_url_existing: '/api/word/is-url-existing/',
      save: '/api/word/save/',
    },
    pron: {
      search: '/api/pron/search',
      save: '/api/pron/save',
      delete: '/api/pron/delete',
    },
    meaning: {
      search: '/api/mean/search',
    },
    meaning_usage: {
      search: '/api/mean-usage/search',
    },
    meaning_usage_example: {
      search: '/api/mean-example/search',
    },
    search: {
      word: '/api/search/word',
    }
  },
};


export {HOST};
