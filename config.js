require('dotenv').load();

var environments = {
  development: {
    URL: process.env.URL_DEVELOPMENT || 'http://local.developing:4040/',
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY_DEVELOPMENT,
  },
  staging: {
    URL: process.env.URL_STAGING || 'http://local.developing:5050/',
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY_STAGING,
  },
  production: {
    URL: process.env.URL_PRODUCTION || 'http://local.developing:6060/',
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY_PRODUCTION
  }
};

module.exports = environments;
