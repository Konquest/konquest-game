// generated on 2015-09-28 using generator-gulp-webapp 1.0.3
var gulp = require('gulp')
var browserSync = require('browser-sync')
var del = require('del')
var browserify = require('browserify')
var source = require('vinyl-source-stream')

var $ = require('gulp-load-plugins')()
var reload = require('browser-sync').reload

gulp.task('styles', () => {
  return gulp.src('app/styles/*.css')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}))
})

gulp.task('game-engine', () => {
  return browserify({entries: 'lib/game-engine/index.js', standalone: 'GameEngine'})
    .bundle()
    .pipe($.plumber())
    .pipe(source('game-engine.js'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}))
})

gulp.task('html', ['styles', 'game-engine'], () => {
  return gulp.src('app/*.html')
    .pipe($.plumber())
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.plumber())
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err)
      this.end()
    })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('extras', () => {
  var extras = [
    'app/*.*',
    '!app/*.html'
  ]

  return gulp.src(extras, { dot: true })
    .pipe($.plumber())
    .pipe(gulp.dest('dist'))
})

gulp.task('maps', () => {
  return gulp.src('app/maps/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/maps'))
})

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('watch:frontend', () => {
  browserSync({
    notify: false,
    open: false,
    port: 9000,
    proxy: {
      target: 'localhost:9100',
      ws: true
    }
  })

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*',
    '.tmp/scripts/**/*.js'
  ]).on('change', function () {
    console.log('FE change -- reload')
    reload()
  })

  gulp.watch('app/styles/**/*.css', ['styles'])
  gulp.watch('app/fonts/**/*', ['fonts'])
  gulp.watch('lib/game-engine/**/*', ['game-engine'])
})

gulp.task('watch:backend', () => {
  return $.nodemon({
    script: 'index.js',
    watch: [
      'server',
      'lib',
      'index.js'
    ]
  })
  .once('quit', function () {
    process.exit()
  })
})

gulp.task('serve', ['styles', 'fonts', 'game-engine'], () => {
  gulp.start(['watch:frontend', 'watch:backend'])
})

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  })
})

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })

  gulp.watch('test/spec/**/*.js').on('change', reload)
// gulp.watch('test/spec/**/*.js', ['lint:test'])
})

gulp.task('build', ['html', 'images', 'fonts', 'extras', 'maps'], () => {
  return gulp.src('dist/**/*')
    .pipe($.plumber())
    .pipe($.size({title: 'build', gzip: true}))
})

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})
