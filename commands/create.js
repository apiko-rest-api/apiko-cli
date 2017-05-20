'use strict'

const fs = require('fs')
const exec = require('child_process').exec
const commandExists = require('command-exists').sync

module.exports = {
  usage: "apiko create <directory_name> [template_name]\n• Creates a new directory with the specified name and downloads the Apiko starter template to it.\n- You can then navigate to it, run 'npm i' and 'apiko run dev' to start Apiko in development mode.",
  handler (templateName) {
    return new Promise((resolve, reject) => {
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
              g.log(1, 'Creating a new Apiko project (' + tpl + ')...')
              g.cli.templates.list[tpl].create().then(() => {
                resolve()
              }).catch(() => {
                reject()
              })
            } else if (tpl === '') {
              g.log(1, 'Creating a new Apiko project (' + templateName + ')...')
              g.cli.templates.list[templateName].create().then(() => {
                resolve()
              }).catch(() => {
                reject()
              })
            } else {
              g.log.e(0, 'Such template does not seem to exist.')
              process.exit(1)
            }
          })
        } else {
          if (g.cli.templates.list[tpl]) {
            g.log(1, 'Creating a new Apiko project (' + templateName + ')...')
            g.cli.templates.list[templateName].create().then(() => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            g.log.e(0, 'Such template does not seem to exist.')
            process.exit(1)
          }
        }
      }).catch(() => {
        reject()
      })
    })
  }
}
