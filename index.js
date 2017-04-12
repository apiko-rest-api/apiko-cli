#!/usr/bin/env node
const fs = require('fs')
const exec = require('child_process').exec
const commandExists = require('command-exists').sync
const path = require('path')

let cli = {
  init: {
    usage: "apiko init <directory_name>\n- Creates a new directory with the specified name and downloads the Apiko starter template to it.\n- You can then navigate to it, run 'npm i' and 'npm run dev' to start Apiko in development mode.",
    handler () {
      console.log('Initiating a new Apiko server...')
      if (fs.existsSync(process.argv[3])) {
        console.log('The specified directory already exists. Please try a different directory name or remove this one first.')
        return false
      }

      if (!commandExists('git')) {
        console.log('It seems like Git is not installed here. Follow these instructions: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')
        return false
      }

      let cmd = exec('git clone https://github.com/kasp1/apiko-start.git ' + process.argv[3])
      cmd.stderr.pipe(process.stderr)

      return cmd
    }
  },

  setup: {
    usage: "apiko setup <directory_name>\n- Creates a new directory with the specified name and installs and runs Apiko in it.",
    handler () {
      let init = cli.init.handler()

      if (init !== false) {
        init.on('close', (code) => {
          if (code === 0) {
            console.log('Setting up a new Apiko server...')

            // change to the created directory
            process.chdir(process.cwd() + path.sep + process.argv[3])

            // npm install
            let cmd = exec('npm install')
            cmd.stderr.pipe(process.stderr)

            cmd.on('close', (code) => {
              cli.run.handler('dev')
            })
          }
        })
      }
    }
  },

  run: {
    usage: "apiko run <config_mode>\n- Starts Apiko with your config mode specified.",
    handler (env) {
      if (!env) {
        if (process.argv[3]) {
          env = process.argv[3]
        } else {
          cli.help.handler('run')
        }
      }

      let cmd = exec('npm run ' + env)
      cmd.stdout.pipe(process.stdout)
      cmd.stderr.pipe(process.stderr)
    }
  },

  help: {
    usage: "apiko help <command_name>\n- Displays help for the specified command.",
    handler (command) {
      if (!command) {
        if (cli[process.argv[3]]) {
          console.log(cli[process.argv[3]].usage)
        } else {
          console.log("Apiko CLI - makes it easy to set up a new Apiko server.")
          console.log('')
          console.log("apiko setup <directory_name> # to setup a new Apiko server.")
          console.log('')
          console.log('Other commands: ', Object.keys(cli).join(', '))
          console.log("apiko help <command_name> # to read further.")
          console.log('')
          console.log('')
        }
      } else {
        console.log(cli[command].usage)
      }
    }
  }
}

if (process.argv[2]) {
  if (cli[process.argv[2]]) {
    cli[process.argv[2]].handler()
  } else {
    cli.help.handler()
  }
} else {
  cli.help.handler()
}