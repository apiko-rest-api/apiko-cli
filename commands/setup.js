'use strict'

const exec = require('child_process').exec
const commandExists = require('command-exists').sync
const path = require('path')
const fs = require('fs')

module.exports = {
  usage: "apiko setup <directory_name>\n• Creates a new directory with the specified name and installs and runs the Apiko starter project in it.",
  handler (templateName) {
    if (!process.argv[3]) {
      g.cli.help.handler('setup')
      process.exit(1)
    }
    
    if (fs.existsSync(process.argv[3])) {
      g.log.e(0, 'The specified directory (' + process.argv[3] + ') already exists. Please move it away first.')
      process.exit(1)
    }

    let ask = false
    if (!templateName) {
      if (process.argv[4]) {
        templateName = process.argv[4]
      } else {
        templateName = 'start'
        ask = true
      }
    }

    if (!commandExists('git')) {
      g.log(1, 'It seems like Git is not installed here. Follow these instructions: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')
      process.exit(0)
    }
    
    g.cli.templates.update().then(() => {
      if (ask) {
        console.log('Please select a template:')
        g.cli.templates.printList()
        g.interface.question('Which template would you like to use? [' + templateName + '] ', (tpl) => {
          if (g.cli.templates.list[tpl]) {
            g.log(1, 'Setting up a new Apiko project (' + tpl + ')...')
            g.cli.templates.list[tpl].setup()
          } else if (tpl === '') {
            g.log(1, 'Setting up a new Apiko project (' + templateName + ')...')
            g.cli.templates.list[templateName].setup()
          } else {
            g.log.e(0, 'Such template does not seem to exist.')
            process.exit(1)
          }
        })
      } else {
        if (g.cli.templates.list[tpl]) {
          g.log(1, 'Setting up a new Apiko project (' + templateName + ')...')
          g.cli.templates.list[templateName].setup()
        } else {
          g.log.e(0, 'Such template does not seem to exist.')
          process.exit(1)
        }
      }
    })
  }
}