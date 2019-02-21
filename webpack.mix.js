const mix = require('laravel-mix')
const path = require('path')

mix.webpackConfig({
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'resources/assets/js'),
    },
  },
})

mix.options({
  hmrOptions: {
    host: 'localhost',
    port: 8082,
  },
})

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/main.js', 'public/assets/js')
  .stylus('resources/assets/stylus/main.styl', 'public/assets/css')
  .sass('resources/assets/sass/app.scss', 'public/assets/css')

// Version does not work in HMR mode
// https://github.com/JeffreyWay/laravel-mix/issues/1176
if (process.env.npm_lifecycle_event !== 'hot') mix.version()
