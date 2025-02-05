import { promises as fs } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

const tags = {
  'main': 'INFO',
  'search': 'SEARCH',
  'game': 'GAME',
  'serbot': 'SUB BOTS',
  'rpg': 'RPG',
  'rg': 'REGISTRO',
  'sticker': 'STICKER',
  'img': 'IMAGE',
  'group': 'GROUPS',
  'nable': 'ON / OFF', 
  'premium': 'PREMIUM',
  'downloader': 'DOWNLOAD',
  'tools': 'TOOLS',
  'fun': 'FUN',
  'nsfw': 'NSFW', 
  'cmd': 'DATABASE',
  'owner': 'OWNER', 
  'audio': 'AUDIOS', 
  'advanced': 'ADVANCED',
}

const defaultMenu = {
  before: `
*🌀💙🌀⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯🌀💙🌀*
" Hola *%name* soy *Hatsune Miku*, %greeting "
 💙🥬██▓▒­░⡷⠂𝙷𝚊𝚝𝚜𝚞𝚗𝚎⠐⢾░▒▓██🥬💙
     💙🥬꧁ღ💙🅼🅸🅺🆄💙ღ꧂🥬💙
╔══════[ I N F O 💙 B O T ]══════╗
║╔───────────•••════════╗
╚║B 💙 Modo : Público                    ║
  ║0│V 📚 Baileys : Multi Device     ║
  ║1│H ⏱ Tiempo Activo : %muptime      ║
  ║┬│3 👤 Usuarios : %totalreg              ║
  ║╚───────•••═══════════╝
  ╚════════════◉═══════════╝
`.trimStart(),
  header: '╔═══◇◆🥬【 𝑴𝑬𝑵Ú メ %category 】🥬◆◇═══╗\n║╔───────────────────────────',
  body: '🩵║ %cmd %islimit %isPremium\n',
  footer: '║╚───────────────────────────\n╚═════════◆◇◆═════════╝\n',
  after: `> 🩵 ${process.env.TEXTBOT || 'Hatsune Miku Bot'}`
}

const handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Read package.json with error handling
    let _package = {}
    try {
      _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')))
    } catch (e) {
      console.error('Failed to read package.json:', e)
    }

    // Get user data with default values
    const { exp = 0, limit = 0, level = 0 } = global.db.data.users[m.sender] || {}
    const { min, xp, max } = xpRange(level, global.multiplier)
    
    // Get user name safely
    let name = ''
    try {
      name = await conn.getName(m.sender)
    } catch (e) {
      console.error('Failed to get user name:', e)
      name = m.sender.split('@')[0]
    }

    // Time calculations
    const d = new Date()
    const locale = 'es'
    const time = d.toLocaleTimeString(locale)
    const uptime = process.uptime() * 1000
    const muptime = clockString(uptime)
    
    // Get total registered users
    const totalreg = Object.keys(global.db.data.users || {}).length

    // Get greeting based on hour
    const greeting = getGreeting(d.getHours())

    // Get help menu
    const help = Object.values(global.plugins || {})
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }))

    // Build menu text
    let text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return defaultMenu.body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '◜💙◞' : '')
                .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
                .trim()
            }).join('\n')
          }),
          defaultMenu.footer
        ].join('\n')
      }),
      defaultMenu.after
    ].join('\n')

    // Replace variables in text
    text = text.replace(new RegExp(`%(${Object.keys({
      '%': '%',
      p: _p, uptime, muptime,
      name, totalreg,
      greeting
    }).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + {
      '%': '%',
      p: _p, uptime, muptime,
      name, totalreg,
      greeting
    }[name])

    // Send menu message
    await m.react('💙')
    
    await conn.sendMessage(m.chat, {
      video: { url: 'https://qu.ax/OaOR.mp4' },
      gifPlayback: true,
      caption: text.trim(),
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error('Menu error:', e)
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 
handler.register = true

export default handler

// Helper functions
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getGreeting(hour) {
  const greetings = {
    0: 'una linda noche 🌙',
    1: 'una linda noche 💤',
    2: 'una linda noche 🦉',
    3: 'una linda mañana ✨',
    4: 'una linda mañana 💫',
    5: 'una linda mañana 🌅',
    6: 'una linda mañana 🌄',
    7: 'una linda mañana 🌅',
    8: 'una linda mañana 💫',
    9: 'una linda mañana ✨',
    10: 'un lindo dia 🌞',
    11: 'un lindo dia 🌨',
    12: 'un lindo dia ❄',
    13: 'un lindo dia 🌤',
    14: 'una linda tarde 🌇',
    15: 'una linda tarde 🥀',
    16: 'una linda tarde 🌹',
    17: 'una linda tarde 🌆',
    18: 'una linda noche 🌙',
    19: 'una linda noche 🌃',
    20: 'una linda noche 🌌',
    21: 'una linda noche 🌃',
    22: 'una linda noche 🌙',
    23: 'una linda noche 🌃'
  }
  return "espero que tengas " + (greetings[hour] || 'un buen día ✨')
}
