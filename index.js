#!/usr/bin/env node
'use strict'

global.g = global
g.log = require('./log')

g.config = {
  verbosity: 1
}

g.cli = {
  create: require('./commands/create'),
  setup: require('./commands/setup'),
  run: require('./commands/run'),
  help: require('./commands/help'),
  templates: require('./commands/templates')
}

if (process.argv.indexOf('--verbose') >= 0) {
  g.config.verbosity = 3
}

if (process.argv[2]) {
  if (g.cli[process.argv[2]]) {
    g.cli[process.argv[2]].handler()
  } else {
    g.cli.run.handler(process.argv[2])
  }
} else {
  g.cli.help.handler()
}
