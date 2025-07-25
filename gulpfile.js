const fileInclude = require('gulp-file-include'); //footer i header

const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    {sassAsync} = require('gulp5-sass-plugin'),
    sourcemap = require("gulp-sourcemaps"),
    cleanCSS = require('gulp-clean-css'),
    mediaQueries = require('gulp-group-css-media-queries'),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    htmlMin = require('gulp-htmlmin'),
    imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    {deleteSync} = require('del'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    webp = require("gulp-webp"),
    babel = require('gulp-babel'),
    cheerio = require('gulp-cheerio');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sourcemap.init())
        .pipe(sassAsync({ outputStyle: 'expanded' }))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js-script', function () {
    return gulp.src('app/js/script.js')
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/slick-carousel/slick/slick.min.js', 'app/js/script.js'])
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('svg-sprite', function () {
    return gulp.src("app/img/icons/*.svg")
        .pipe(cheerio({
            run: ($) => {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/img"));
});

gulp.task('clean', function (done) {
    deleteSync('dist');
    done();
});

gulp.task('js-prod', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/slick-carousel/slick/slick.min.js', 'app/js/script.js'])
        .pipe(concat('all.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sassAsync())
        .pipe(mediaQueries())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(fileInclude({prefix: '@@', basepath: 'app/includes'}))
        .pipe(replace('style.css', 'style.min.css'))
        .pipe(replace('all.js', 'all.min.js'))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src(["app/img/**/*.{png,jpg,svg}", "!app/img/sprite.svg", "!app/img/icons/*.svg"])
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svg-sprite-prod', function () {
    return gulp.src("app/img/icons/*.svg")
        .pipe(cheerio({
            run: ($) => {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("dist/img"));
});

gulp.task('copy-dist', function (done) {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
    done();
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
    gulp.watch('app/img/icons/*.svg', gulp.parallel('svg-sprite'));
    gulp.watch('app/js/script.js', gulp.parallel('js', 'js-script'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch('app/includes/**/*.html', gulp.series('file-include', 'code'));  
});

// gulp.task('default', gulp.parallel('sass', 'js', 'js-script', 'svg-sprite', 'browser-sync', 'watch'));  //  Запускаем задачи в режиме разработки командой gulp

gulp.task('file-include', function() {
    return gulp.src('app/*.html')
      .pipe(fileInclude({
        prefix: '@@',
        basepath: 'app'      // ← меняем здесь
      }))
      .pipe(gulp.dest('app'));
  });

  gulp.task('default',
    gulp.series(
      'file-include',
      gulp.parallel(
        'sass',
        'js',
        'js-script',
        'svg-sprite',
        'browser-sync',
        'watch'
      )
    )
  );
gulp.task('build', gulp.series('file-include', 'clean', 'css', 'js-prod', 'html', 'optimize-images', 'svg-sprite-prod', 'copy-dist')); //  Собираем проект для продакшена командой gulp build

gulp.task('webp', function () {
    return gulp.src("app/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("app/img"))
});

gulp.task('webp-prod', function () {
    return gulp.src("app/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("dist/img"))
});



