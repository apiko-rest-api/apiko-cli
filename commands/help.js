'use strict'

module.exports = {
  usage: "apiko help <command_name>\n- Displays help for the specified command.",
  handler (command) {
    if (!command) {
      if (global.cli[process.argv[3]]) {
        g.log(global.cli[process.argv[3]].usage)
      } else {
        g.log(1, "Apiko CLI - makes it easy to set up a new Apiko project.")
        g.log(1, '')
        g.log(1, "apiko setup <directory_name> # to setup a new Apiko project.")
        g.log(1, '')
        g.log(1, 'Other commands: ', Object.keys(global.cli).join(', '))
        g.log(1, "apiko help <command_name> # to read further.")
        g.log(1, '')
        g.log(1, '')
      }
    } else {
      g.log(1, global.cli[command].usage)
    }
  }
}
