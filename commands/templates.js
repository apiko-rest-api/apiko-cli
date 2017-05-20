'use strict'

const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const request = require('request')
const hasha = require('hasha')

module.exports = {
  usage: "apiko templates\n- Lists the avaialbe template apps.",
  dir: path.normalize(__dirname + '/../templates'),
  list: {},
  handler () {
    this.update().then(() => {
      g.log(1, 'Listing available templates...')
      g.cli.templates.printList()
      process.exit(0)
    })
  },
  update () {
    return new Promise((resolve, reject) => {
      g.log(1, 'Synchronizing the local list of templates...')
      
      if (!fs.existsSync(g.cli.templates.dir)) {
        fs.mkdirSync(g.cli.templates.dir)
      }

      request({
        uri: 'https://api.github.com/repos/apiko-rest-api/apiko-tpls/contents/templates',
        headers: { 'User-Agent': 'Apiko CLI' }
      },
      (error, response, body) => {
        let onlineFiles = JSON.parse(body)
        let files = fs.readdirSync(g.cli.templates.dir)

        let checks = []
  
        for (let onlineFile in onlineFiles) {
          if (files.indexOf(onlineFiles[onlineFile].name) >= 0) {
            checks.push(new Promise((resolve, reject) => {
              let cmd = exec('git hash-object ' + path.normalize(g.cli.templates.dir + '/' + onlineFiles[onlineFile].name))
              let hash
              
              cmd.stdout.on('data', (data) => {
                hash += data
              })

              cmd.on('close', (code) => {
                hash = hash.trim().replace('undefined', '')

                if (hash !== onlineFiles[onlineFile].sha) {
                  if (process.argv.indexOf('--no-update') < 0) {
                    g.log(1, 'Updating ' + onlineFiles[onlineFile].name.replace('.js', '') + '...')
                    g.cli.templates.download(onlineFiles[onlineFile]).then(() => resolve())
                  } else {
                    g.log(1, 'Skipping update of ' + onlineFiles[onlineFile].name.replace('.js', '') + ' because of --no-update.')
                    resolve()
                  }
                } else {
                  resolve()
                }

                resolve(code)
              })
            }))
          } else {
            g.log(1, 'Downloading ' + onlineFiles[onlineFile].name.replace('.js', '') + '...')
            checks.push(g.cli.templates.download(onlineFiles[onlineFile]))
          }
        }
        
        Promise.all(checks).then(() => {
          let template
          for (let i in files) {
            if (files[i].indexOf('.js') >= 0) {
              template = require(path.normalize(g.cli.templates.dir + '/' + files[i]))
              g.cli.templates.list[files[i].replace('.js', '')] = template
            }
          }

          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    })
  },
  printList () {
    console.log('')
    for (var i in g.cli.templates.list) {
      console.log('•', g.cli.templates.list[i].title, '(' + i + ')', '-', g.cli.templates.list[i].description)
    }
    console.log('')
  },
  download (file) {
    return new Promise((resolve, reject) => {
      request({ uri: file.download_url }, (error, response, body) => {
        fs.writeFileSync(path.normalize(g.cli.templates.dir + '/' + file.name), body)
        resolve()
      })
    })
  }
}