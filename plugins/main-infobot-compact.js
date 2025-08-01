import { cpus as _cpus, totalmem, freemem, platform, hostname, version, release, arch } from 'os'
import speed from 'performance-now'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import ws from 'ws'

let format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix }) => {
   let uniqueUsers = new Map()

   // Fix: Initialize global.conns as an empty array if it doesn't exist
   global.conns = global.conns || []
   
   // Use the initialized array
   global.conns.forEach((conn) => {
     if (conn && conn.user && conn.ws && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
       uniqueUsers.set(conn.user.jid, conn)
     }
   })
   
   let users = [...uniqueUsers.values()]
   let totalUsers = users.length
   let totalreg = Object.keys(global.db.data.users).length
   let totalbots = Object.keys(global.db.data.settings).length
   let totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0)
   const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
   let totalchats = Object.keys(global.db.data.chats).length
   let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length
   const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) //groups.filter(v => !v.read_only)
   const used = process.memoryUsage()
   const cpus = _cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
      return cpu
   })
   const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total
      last.speed += cpu.speed / length
      last.times.user += cpu.times.user
      last.times.nice += cpu.times.nice
      last.times.sys += cpu.times.sys
      last.times.idle += cpu.times.idle
      last.times.irq += cpu.times.irq
      return last
   }, {
      speed: 0,
      total: 0,
      times: {
         user: 0,
         nice: 0,
         sys: 0,
         idle: 0,
         irq: 0
      }
   })
   let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
   let timestamp = speed()
   let latensi = speed() - timestamp
   
   // Define textbot or use a default value if it doesn't exist
   let textbot = global.textbot || '¡Gracias por usar Hatsune Miku Bot!'
   
   let txt = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸                                     KIVOTOS ACADEMY                                              🌸┃
┃💙                                  INFORMACIÓN DEL SISTEMA                                         💙┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔═══════════════════════════════════════╗
║🤖        DATOS DEL BOT         🤖║
╠═══════════════════════════════════════╣
║🌸 Sistema: Tachibana Nozomi Bot     ║
║🏫 Academia: Millennium Science      ║
║🎯 Club: Ingeniería                  ║
║💙 Presidenta: Tachibana Nozomi      ║
║💰 Moneda: 🌱 Cebollines             ║
║🔧 Prefijo: ${usedPrefix}                           ║
║🧩 Plugins: ${totalf}                              ║
║🤖 Sub-Bots: ${totalUsers || '0'}                 ║
║🖥️ OS: ${platform()}                              ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║⚡      RENDIMIENTO SISTEMA      ⚡║
╠═══════════════════════════════════════╣
║🧠 RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}║
║🆓 Libre: ${format(freemem())}                    ║
║⚡ Ping: ${latensi.toFixed(4)} ms               ║
║📊 Comandos: ${formatNumber(totalStats)}         ║
║🌍 Grupos: ${formatNumber(totalchats)}           ║
║👥 Usuarios: ${formatNumber(totalreg)}           ║
╚═══════════════════════════════════════╝

🌸 *Mensaje de Tachibana Nozomi:*
"¡Como presidenta del Club de Ingeniería, me enorgullece presentar nuestro sistema! Este bot representa la culminación de nuestra tecnología para Kivotos."

💙 *Estado:* ✅ **OPERATIVO** | 🎯 *Objetivo:* Hacer de Kivotos un lugar mejor

> 💙 *${textbot}*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🎀                          🌟 Millennium Science School Engineering 🌟                           🎀┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`

   // Fix for the mimetype error: Check if the file exists or use a different approach
   try {
     const fs = await import('fs')
     const path = './storage/img/menu.jpg'
     
     if (fs.existsSync(path)) {
       await conn.sendFile(m.chat, path, 'thumbnail.jpg', txt, m)
     } else {
       // If the file doesn't exist, just send the text
       await conn.reply(m.chat, txt, m)
     }
   } catch (error) {
     // Fallback if there's any error
     await conn.reply(m.chat, txt, m)
     console.log('Error sending file:', error)
   }
}
handler.help = ['info']
handler.tags = ['main']
handler.command = ['info', 'infobot']

export default handler

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' D ', h, ' H ', m, ' M ', s, ' S'].map(v => v.toString().padStart(2, 0)).join('')
}
