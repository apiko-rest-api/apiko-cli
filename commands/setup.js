const exec = require('child_process').exec
const path = require('path')

module.exports = {
  usage: "apiko setup <directory_name>\n- Creates a new directory with the specified name and installs and runs the Apiko starter template in it.",
  handler () {
    return new Promise((resolve, reject) => {
      g.cli.create.handler('starter').then((code) => {
        if (code === 0) {
          g.log(1, 'Setting up a new Apiko project...')

          // change to the created directory
          process.chdir(process.cwd() + path.sep + process.argv[3])

          // npm install
          let cmd = exec('npm install')

          if (g.cli.verbosity >= 2) {
            cmd.stdout.pipe(process.stdout)
            cmd.stderr.pipe(process.stderr)
          }

          cmd.on('close', (code) => {
            g.cli.run.handler('dev')
          })
        } else {
          process.exit(0)
        }
      })
    })
  }
}