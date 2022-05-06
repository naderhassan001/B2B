import gulp from 'gulp'
import babel from 'gulp-babel'
import dotenv from 'dotenv/config'
import gulp_mjml from 'gulp-mjml'
import htmlbeautify from 'gulp-html-beautify'
import flatten from 'gulp-flatten'
import fs from 'fs'
import path from 'path'
import mjml2html from 'mjml'
import { registerComponent } from 'mjml-core'

/**********************
* Variables
**********************/


/**********************
* Helper functions
**********************/


/***************************
* Component Registration
***************************/
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file))
  })
 return filelist
}

const watchedComponents = walkSync('./components')

/**********************
* Gulp Tasks
**********************/
gulp.task('build-components', () => {
  return gulp.src(path.normalize('./components/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest('./lib'))
    .on('end', () => {
      watchedComponents.forEach(compPath => {
        const fullPath = path.join(process.cwd(), compPath.replace('components', 'lib'))
        delete require.cache[fullPath]
        registerComponent(require(fullPath).default)
        console.log('\nFinished building components.\n')
      })
    })
})

//transpile weekly campaigns here
gulp.task('build-emails', () => {
  const emails = process.env.npm_config_emails.split(',')
  emails.forEach((email) => {
    return gulp.src(`./mjml/**/${email}.mjml`)
    .on('error', () => { console.log('error') })
    .pipe(gulp_mjml(mjml2html, {minify: true}))
    .pipe(htmlbeautify({indent_size: 2}))
    .pipe(flatten())
    .pipe(gulp.dest('./dist'))
  })
})
