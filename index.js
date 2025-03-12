import chalk from 'chalk'
import { main } from './src/main.js'

const art =
  chalk.blueBright(`
░█▀▀░█▀█░█▄█░█▀█░▀█▀░█▀█    
░▀▀█░█░█░█░█░█░█░░█░░█▀█    
░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀    `) +
  chalk.magentaBright(`
░▀█▀░█▀▀░█▀▀░▀█▀░█▀█░█▀▀░▀█▀
░░█░░█▀▀░▀▀█░░█░░█░█░█▀▀░░█░
░░▀░░▀▀▀░▀▀▀░░▀░░▀░▀░▀▀▀░░▀░`) +
  chalk.whiteBright(`
`)

console.log(art)

main()
