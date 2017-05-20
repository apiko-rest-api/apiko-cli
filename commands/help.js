'use strict'

module.exports = {
  usage: "apiko help <command_name>\n• Displays help for the specified command.",
  handler (command) {
    if (!command) {
      if (global.cli[process.argv[3]]) {
        console.log(global.cli[process.argv[3]].usage)
      } else {
        console.log("Apiko CLI - makes it easy to set up a new Apiko project.")
        console.log('')
        console.log("apiko setup <directory_name> # to setup a new Apiko project.")
        console.log('')
        console.log('Other commands: ', Object.keys(global.cli).join(', '))
        console.log("apiko help <command_name> # to read further.")
        console.log('')
        console.log('Options: ')
        console.log("--no-update # doesn't update template scripts if they don't meet the online mirror checksums (handy for developing).")
        console.log('')
        process.exit(0)
      }
    } else {
      g.log(0, global.cli[command].usage)
    }
  }
}
