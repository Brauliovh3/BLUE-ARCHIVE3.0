import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': '📋 Información Principal',
  'search': '🔍 Búsqueda',
  'game': '🎮 Juegos',
  'serbot': '🤖 Sub-Bots',
  'rpg': '⚔️ RPG',
  'rg': '📝 Registro',
  'sticker': '🎭 Stickers',
  'img': '🖼️ Imágenes',
  'group': '👥 Grupos',
  'nable': '⚡ Activar/Desactivar', 
  'premium': '💎 Premium',
  'downloader': '📥 Descargas',
  'tools': '🛠️ Herramientas',
  'fun': '🎪 Diversión',
  'nsfw': '🔞 NSFW', 
  'cmd': '💾 Base de Datos',
  'owner': '👑 Creador', 
  'audio': '🎵 Audios', 
  'advanced': '⚙️ Avanzado',
}

const defaultMenu = {
  before: `
╭─────────────────────────╮
│✦ 𝗕𝗟𝗨𝗘 𝗔𝗥𝗖𝗛𝗜𝗩𝗘 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧 ✦│
╰─────────────────────────╯

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸¡Hola *%name*! Soy *TACHIBANA NOZOMI*🌸
┃  
┃💫Estudiante de Millennium Science School
┃🎯Especialista en información y estrategia
┃✨%greeting
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔═════════════════════╗
║📊 ESTADO DEL SISTEMA  ║
╠════════════════════╣
║ 🌐 Modo: Público                 ║
║ ⚡ Baileys: Multi Device         ║
║ ⏰ Tiempo Activo: %muptime       ║
║ 👥 Usuarios Registrados: %totalreg ║
║ 📅 Fecha: %date                  ║
║ 🕐 Hora: %time                   ║
╚════════════════════╝

%readmore
┏━━━━━━━━━━━━━━━━━━━┓
┃🎯 𝗠𝗘𝗡𝗨́ 𝗗𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦┃
┗━━━━━━━━━━━━━━━━━━━┛
`.trimStart(),
  header: `
╔═════════════════╗
║🎨 %category
╚═════════════════╝`,
  body: `┃ 🔹 %cmd %islimit %isPremium`,
  footer: `╚═════════════════════════╝\n`,
  after: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃💙 Blue Archive - Millennium School ┃
┃🌸 Tachibana Nozomi siempre lista   ┃
┃✨ para ayudarte en tu aventura     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> 🎯 *¡Usa los comandos sabiamente, Sensei!*
> 💎 *Premium* = Comando premium
> ⭐ *Límite* = Comando con límite de uso

─────────────────────────────
🌟 *¿Necesitas ayuda?* Escribe *#help [comando]*
💫 *Empresa:* ${textbot || 'Blue Archive Channel'}
─────────────────────────────`,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : ``) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '⭐' : '')
                .replace(/%isPremium/g, menu.premium ? '💎' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      wasp: '@0',
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      version: _package.version,
      npmdesc: _package.description,
      npmmain: _package.main,
      author: _package.author?.name || 'Unknown',
      license: _package.license,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      greeting, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    
    let blueArchiveImages = [
      'https://media.tenor.com/a_ie-YlAL1YAAAAe/blue-archive-tachibana-nozomi.png', 
      'https://i.pinimg.com/736x/eb/a4/fb/eba4fbad60730bc11bbabef0966a69b2.jpg', 
      'https://i.pinimg.com/736x/9b/1f/8d/9b1f8d438239d54c06af279bffbcfae3.jpg', 
    ]
    
    let img = `./storage/img/menu.jpg`
    await m.react('🌸') 
    
    
    await conn.sendFile(m.chat, img, 'blue_archive_menu.jpg', text.trim(), m, null, rcanal)

  } catch (e) {
    conn.reply(m.chat, '❌ Lo siento, Sensei. Hay un error en el sistema del menú.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 
handler.register = true 
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}


var ase = new Date();
var hour = ase.getHours();
switch(hour){
  case 0: hour = 'una tranquila noche de estudio 🌙📚'; break;
  case 1: hour = 'un descanso nocturno reparador 💤✨'; break;
  case 2: hour = 'una noche de vigilancia académica 🦉📖'; break;
  case 3: hour = 'una madrugada llena de posibilidades 🌟'; break;
  case 4: hour = 'un amanecer de nuevos desafíos 💫🎯'; break;
  case 5: hour = 'un hermoso amanecer escolar 🌅🏫'; break;
  case 6: hour = 'una mañana perfecta para entrenar 🌄⚡'; break;
  case 7: hour = 'una energética mañana de clases 🌅📝'; break;
  case 8: hour = 'una productiva mañana académica 💫📚'; break;
  case 9: hour = 'una brillante mañana de aprendizaje ✨🎓'; break;
  case 10: hour = 'un día perfecto para misiones 🌞🎯'; break;
  case 11: hour = 'un día de estrategias y táctica 🌨️⚔️'; break;
  case 12: hour = 'un mediodía de decisiones importantes ❄️🎪'; break;
  case 13: hour = 'una tarde de análisis y datos 🌤️📊'; break;
  case 14: hour = 'una relajante tarde escolar 🌇🎒'; break;
  case 15: hour = 'una tarde de club y actividades 🥀🎭'; break;
  case 16: hour = 'una hermosa tarde de compañerismo 🌹👥'; break;
  case 17: hour = 'una mágica tarde de Millennium 🌆🏢'; break;
  case 18: hour = 'una serena noche de planificación 🌙📋'; break;
  case 19: hour = 'una tranquila noche urbana 🌃🌆'; break;
  case 20: hour = 'una noche estrellada de reflexión 🌌⭐'; break;
  case 21: hour = 'una noche de camaradería estudiantil 🌃👫'; break;
  case 22: hour = 'una pacífica noche de descanso 🌙😴'; break;
  case 23: hour = 'una noche de preparación para mañana 🌃📅'; break;
}
var greeting = "espero que tengas " + hour;
