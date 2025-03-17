let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break

    case 'autoread':
    case 'autoleer':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      break

    case 'document':
    case 'documento':
      isUser = true
      user.useDocument = isEnable
      break

    case 'antitoxic':
    case 'antigroserías':
    case 'onlyclean':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiToxic = isEnable
      break

    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break

    case 'antiarabes':
    case 'antinegros':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.onlyLatinos = isEnable
      break

    case 'antiperuanos':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.onlyPeru = isEnable
      break

    case 'antilink2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink2 = isEnable
      break

    default:
      if (!/[01]/.test(command)) return m.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━╮
│ 💙 *Hatsune Miku Configuración* 💙
╰━━━━━━━━━━━━━━━━━━━━━━━╯

📋 *LISTA DE OPCIONES DISPONIBLES*

🔹 *${usedPrefix + command} welcome*  
↳ Activa/Desactiva bienvenida en grupos

🔹 *${usedPrefix + command} nsfw*  
↳ Activa/Desactiva comandos +18 en grupos

🔹 *${usedPrefix + command} antiarabes*  
↳ Activa/Desactiva el anti-árabes en grupos

🔹 *${usedPrefix + command} antiperuanos*  
↳ Activa/Desactiva el anti-peruanos en grupos

🔹 *${usedPrefix + command} antilink*  
↳ Activa/Desactiva el anti-enlaces en grupos

🔹 *${usedPrefix + command} antilink2*  
↳ Activa/Desactiva el anti-enlaces-2 en grupos

🔹 *${usedPrefix + command} autoread*  
↳ Activa/Desactiva la lectura automática

🔹 *${usedPrefix + command} document*  
↳ Activa/Desactiva la descarga como documento

💡 *Ejemplo:* ${usedPrefix + command} welcome
`.trim())
      throw false
  }

 
  m.reply(`
╭─────❬ 💙 *Hatsune Miku* 💙 ❭─────╮
│ 
│ 🔹 Función: *${type}*
│ 🔹 Estado: *${isEnable ? 'ACTIVADA ✅' : 'DESACTIVADA ❌'}*
│ ${isAll ? '🌐 Aplicado globalmente' : isUser ? '👤 Aplicado al usuario' : '👥 Aplicado al grupo'}
│ 
│ 💙 Gracias por usar Hatsune Miku Bot
╰─────❬ 💙 *Hatsune Miku* 💙 ❭─────╯
`.trim())
}

handler.help = ['enable', 'disable']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i
export default handler
