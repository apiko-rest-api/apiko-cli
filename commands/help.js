
module.exports = {
  usage: "apiko help <command_name>\n- Displays help for the specified command.",
  handler (command) {
    if (!command) {
      if (global.cli[process.argv[3]]) {
        console.log(global.cli[process.argv[3]].usage)
      } else {
        console.log("Apiko CLI - makes it easy to set up a new Apiko server.")
        console.log('')
        console.log("apiko setup <directory_name> # to setup a new Apiko server.")
        console.log('')
        console.log('Other commands: ', Object.keys(global.cli).join(', '))
        console.log("apiko help <command_name> # to read further.")
        console.log('')
        console.log('')
      }
    } else {
      console.log(global.cli[command].usage)
    }
  }
}
