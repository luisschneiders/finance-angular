module.exports = function(config) {
  config.set({
    files: [
      // Third-party vendor files
      'vendor/angular.js',
      'vendor/angular-route.js',
      'vendor/angular-mocks.js',
      'vendor/satellizer.js',
      'vendor/chart.js',
      'vendor/moment.min.js',
      'vendor/angular-moment.min.js',
      'vendor/angular-moment.min.js.map',
      'vendor/lodash.min.js',
      'vendor/angular-lodash.js',
      'vendor/jquery-ui.min.js',
      // App entry point
      'app.js',
      // App components, services, controllers, directives, filters, etc.
      'components/**/*.js',
      'shared/**/*.js',
      // Unit tests
      'test/unit/**/*.test.js'
    ],

    autoWatch: true,

    frameworks: ['mocha', 'chai'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-coverage'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'app.js': ['coverage'],
      'components/**/*.js': ['coverage'],
      'shared/**/*.js': ['coverage'],
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'test',
      subdir: 'coverage'
    }
  });
};
