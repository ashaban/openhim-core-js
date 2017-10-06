#!/usr/bin/env node
const forever = require('forever-monitor')
const path = require('path')
const fs = require('fs')

const args = process.argv
args.splice(0, 2)

/* Check for version flag */

if (args.indexOf('-v') >= 0 || args.indexOf('--version') >= 0) {
  const pkgF = path.join(path.dirname(fs.realpathSync(__filename)), '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgF))
  console.log(`OpenHIM Core version ${pkg.version}`)
  process.exit(0)
}

const lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib')

const child = new (forever.Monitor)('server.js', {
  sourceDir: lib,
  command: 'node --harmony',
  args,
  watch: true
})

child.on('watch:restart', (info) => {
  console.error(`Restarting script because ${info.file} changed`)
})

child.on('restart', () => {
  console.error(`Forever restarting script for ${child.times} time`)
})

child.on('exit:code', (code) => {
  console.error(`Forever detected script exited with code ${code}`)
})

child.start()
