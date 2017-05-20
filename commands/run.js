'use strict'

const exec = require('child_process').exec

module.exports = {
  usage: "apiko run <config_mode>\n• Starts Apiko with your config/environment mode specified.",
  handler (env) {
    if (!env) {
      if (process.argv[3]) {
        env = process.argv[3]
      } else {
        global.cli.help.handler('run')
      }
    }
    
    g.log(1, 'Starting Apiko...')

    let cmd = exec('npm run ' + env)

    cmd.stdout.pipe(process.stdout)
    cmd.stderr.pipe(process.stderr)
  }
}