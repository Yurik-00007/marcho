const {src, dest, watch, parallel,series} = require("gulp");
//gulp-scss переводит scss в css
const scss = require('gulp-sass')(require('sass'));
//gulp-concat объединяет все файлы (например css) в один и дает одно имя
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create(); // Создаем экземпляр BrowserSync
// const imagemin = require('gulp-imagemin');

//gulp-autoprefixer добавляет различные префиксы для разных браузеров и версий браузеров чтобы браузер смог понять свойство
// Создаем функцию для динамического импорта gulp-autoprefixer
async function loadAutoprefixer() {
  const autoprefixer = await import('gulp-autoprefixer');
  return autoprefixer.default;
}


async function loadImagemin() {
  const imagemin = await import('gulp-imagemin');
  return imagemin.default;
}

async function loadDel() {
  const del = await import('del');
  return del;
}


//функция изменения(уменьшения) размера кртинки
async function images() {
  //возьми кртинку в этой папке
  const imagemin = await loadImagemin();
  return src('app/images/**/*.{png,jpg,gif,svg,webp}',{
    encoding: false
  })
    //уменьши ее вес
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {removeUnusedNS: false}
        ]
      })
    ]))
    //сохрани измененную картинку сюда
    .pipe(dest('dist/images'))
    .on('end', () => console.log('Images processed and saved to dist/images'));
}

//функция обновления при каких либо изменениях app
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app"
    },
    //убирает уведомления
    notify: false,
  });
}


//создаем функцию, которая будет запускать установленные плагины для scss
async function styles() {
// Запускаем функцию
  const autoprefixer = await loadAutoprefixer();

  return src('app/scss/style.scss')
    /*
//перечислить все файлы в массиве для объединения
  return src([
    'app/scss/style.scss',
  ])
*/
    //переводить scss в css
    // .pipe(scss())
    //переводить scss в css без сжатия
    // .pipe(scss({outputStyle:'expanded'}))
    //переводить scss в css с сжатия
    .pipe(scss({outputStyle: 'compressed'}))
    // дает одно имя для css
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true,
    }))
    //запись (сохранение) выходных данных в указанную директорию
    .pipe(dest('app/css'))
    //если произошли какие-либо изменения в scss обновиться на localhost-е
    .pipe(browserSync.stream())
}

//создаем функцию, которая будет запускать установленные плагины для js
function scripts() {
  // return src(['app/js/**/*.js'])
  //объединяет файлы
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'app/js/main.js'])
    //дает единое имя для объединенных js файлов в один
    .pipe(concat('main.min.js'))
    //сжимает js файл до минимальных размеров
    .pipe(uglify())
    //указывает место, где сохранить этот файл(объединенный)
    .pipe(dest('app/js'))
    //если произошли какие-либо изменения в js обновиться на localhost-е
    .pipe(browserSync.stream())

}

function build() {
  return src(['app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js',
  ], {base: 'app'})
    .pipe(dest('dist'))
}


async function cleanDist() {
  const { deleteAsync } = await loadDel();
  return deleteAsync(['dist']);
}

//функция, которая будет следить за изменениями в scss и автоматически запускать gulp styles
function watching() {
  //функция, которая следит за изменениями в scss
  watch(['app/scss/**/*.scss'], styles)
  //функция, которая следит за изменениями в js
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
  //функция, которая следит за изменениями в html
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

// тут везде нужно было писать gulp и затем styles(gulp styles, gulp scripts, gulp browsersync, gulp watching)
exports.styles = styles
exports.scripts = scripts
exports.browsersync = browsersync
exports.images = images
exports.cleanDist = cleanDist
exports.build = series(cleanDist, images, build)

exports.watching = watching

//теперь можно написать gulp и все запуститься параллельно(благодоря встроенной функции parallel из gulp)
exports.default = parallel(styles, scripts, browsersync, watching);