"use strict"

const colors = require('colors/safe')

//
// Log levels:
//
// 0 - Only fatal errors
// 1 - Important runtime messages and errors
// 2 - All runtime messages, warnings and errors
// 3 - Everything, including dumps and database queries
//
// Usage:
//
// let log = require('./log')
// g.log(loglevel, any number of args here as this was console.log)
// g.log.w(loglevel, any number of args here as this was console.warn)
// g.log.e(loglevel, any number of args here as this was console.error)
//

let log = function () {
  let args = Array.prototype.slice.call(arguments)

  if (args[0] <= g.cli.verbosity) {
    //args[0] = ''
    args.splice(0, 1)
    console.log.apply(console, args)
  }
}

log.w = function () {
  let args = Array.prototype.slice.call(arguments)

  if (args[0] <= g.cli.verbosity) {
    args[0] = 'Warning:'

    for (let i in args) {
      args[i] = colors.yellow(args[i])
    }

    console.warn.apply(console, args)
  }
}

log.e = function () {
  let args = Array.prototype.slice.call(arguments)

  if (args[0] <= g.cli.verbosity) {
    args[0] = 'Error:'

    for (let i in args) {
      args[i] = colors.red(args[i])
    }

    console.error.apply(console, args)
  }
}

module.exports = log