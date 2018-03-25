// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      captureConsole: true,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    files: [
      "https://connect.facebook.net/en_US/sdk.js",
      "https://maps.googleapis.com/maps/api/js?sensor=false"
    ],
    vendor: ["http://maps.googleapis.com/maps/api/js?sensor=false&language=en"],
    crossOriginAttribute: false,
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_security'],  customLaunchers:{
        Chrome_without_security:{
          base: 'Chrome',
          flags: ['--disable-web-security']
        }
    },
    singleRun: false
  });
};
