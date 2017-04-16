#!/usr/bin/env node

global.g = global

g.cli = {
  create: require('./commands/create.js'),
  setup: require('./commands/setup.js'),
  run: require('./commands/run.js'),
  help: require('./commands/help.js')
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
