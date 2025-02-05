import { promises as fs } from 'fs'
import { join } from 'path'
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
  after: '> 🩵 Hatsune Miku Bot'
}

const handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Initialize user data with safe defaults
    const userData = global.db.data.users[m.sender] || {}
    const { exp = 0, limit = 0, level = 0 } = userData
    
    // Get XP range
    const { min, xp, max } = xpRange(level, global.multiplier)
    
    // Get user name safely
    let name = await conn.getName(m.sender).catch(() => m.sender.split('@')[0])
    
    // Calculate uptime
    const uptime = process.uptime() * 1000
    const muptime = clockString(uptime)
    
    // Get total registered users safely
    const totalreg = Object.keys(global.db.data.users || {}).length
    
    // Get plugins safely
    const plugins = Object.values(global.plugins || {}).filter(p => !p.disabled)
    
    // Get current hour for greeting
    const hour = new Date().getHours()
    const greeting = getGreeting(hour)
    
    // Build menu text
    let text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => {
        const categoryPlugins = plugins.filter(p => p.tags && p.tags.includes(tag))
        if (categoryPlugins.length === 0) return ''
        
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + 
          categoryPlugins.map(plugin => {
            const help = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
            return help.map(cmd => 
              defaultMenu.body
                .replace(/%cmd/g, plugin.prefix ? cmd : _p + cmd)
                .replace(/%islimit/g, plugin.limit ? '◜💙◞' : '')
                .replace(/%isPremium/g, plugin.premium ? '◜🪪◞' : '')
                .trim()
            ).join('\n')
          }).join('\n') + 
          defaultMenu.footer
      }).filter(Boolean),
      defaultMenu.after
    ].join('\n')

    // Replace variables
    text = text.replace(new RegExp(`%(${[
      'name', 'greeting', 'muptime', 'totalreg'
    ].join('|')})`, 'g'), (_, name) => ({
      name, greeting, muptime, totalreg
    })[name])

    // Add reaction
    await m.react('💙')

    // Try to send with video first
    try {
      await conn.sendMessage(m.chat, {
        video: { url: 'https://media.tenor.com/TPVTyFQoYqcAAAAC/hatsune-miku.mp4' },
        gifPlayback: true,
        caption: text.trim(),
        mentions: [m.sender]
      }, { quoted: m })
    } catch (videoError) {
      console.error('Failed to send menu with video:', videoError)
      
      // Fallback to just text if video fails
      await conn.sendMessage(m.chat, {
        text: text.trim(),
        mentions: [m.sender]
      }, { quoted: m })
    }

  } catch (e) {
    console.error('Menu error:', e)
    await conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
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
