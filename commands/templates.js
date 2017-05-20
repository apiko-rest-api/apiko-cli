'use strict'

const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')

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
      g.log(1, 'Updating the local list of templates...')
      
      if (!fs.existsSync(g.cli.templates.dir)) {
        fs.mkdirSync(g.cli.templates.dir)
      }

      let files = fs.readdirSync(g.cli.templates.dir)
      
      let template
      for (let i in files) {
        if (files[i].indexOf('.js') >= 0) {
          template = require(path.normalize(g.cli.templates.dir + '/' + files[i]))
          g.cli.templates.list[files[i].replace('.js', '')] = template
        }
      }

      resolve()
    })
  },
  printList () {
    console.log('')
    for (var i in g.cli.templates.list) {
      console.log('•', g.cli.templates.list[i].title, '(' + i + ')', '-', g.cli.templates.list[i].description)
    }
    console.log('')
  }
}