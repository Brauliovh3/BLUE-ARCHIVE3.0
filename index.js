console.log('♀ Iniciando ♪')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

cfonts.say('BLUE\nARCHIVE', {
  font: 'block',
  align: 'center',
  gradient: ['#00D4FF', '#0099CC']
})

cfonts.say('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆', {
  font: 'console',
  align: 'center',
  colors: ['cyan']
})

cfonts.say('💙  TACHIBANA NOZOMI SYSTEM  💙', {
  font: 'console',
  align: 'center',
  gradient: ['#FF69B4', '#00BFFF']
})

cfonts.say('WhatsApp Bot Multi Device | Kivotos Academy', {
  font: 'console',
  align: 'center',
  gradient: ['cyan', 'magenta']
})

cfonts.say('◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆', {
  font: 'console',
  align: 'center',
  colors: ['cyan']
})

let isRunning = false

async function start(files) {
  if (isRunning) return
  isRunning = true

  for (const file of files) {
    const args = [join(__dirname, file), ...process.argv.slice(2)]

    setupMaster({
      exec: args[0],
      args: args.slice(1),
    })

    let p = fork()

    p.on('exit', (code) => {
      isRunning = false
      start(files)

      if (code === 0) return
      watchFile(args[0], () => {
        unwatchFile(args[0])
        start(files)
      })
    })
  }
}

start(['starlights.js'])
