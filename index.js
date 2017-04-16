#!/usr/bin/env node
'use strict'

global.g = global
g.log = require('./log')

g.cli = {
  verbosity: 1,
  create: require('./commands/create'),
  setup: require('./commands/setup'),
  run: require('./commands/run'),
  help: require('./commands/help')
}

if (process.argv.indexOf('--verbose') >= 0) {
  g.cli.verbosity = 3
}

if (process.argv[2]) {
  if (g.cli[process.argv[2]]) {
    g.cli[process.argv[2]].handler()
  } else {
    g.cli.help.handler()
  }
} else {
  g.cli.help.handler()
}
