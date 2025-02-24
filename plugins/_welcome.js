import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://tinyurl.com/2cd94clt')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `💙━━⊱【Hatsune Miku】⊰━━💙
🌟 ¡Bienvenid@! 🌟
🎤 Usuario: @${m.messageStubParameters[0].split`@`[0]}
🎶 Grupo: ${groupMetadata.subject}
💙 ¡Diviértete y disfruta la música! 🎵
💙━━⊱【01】⊰━━💙`
    
    await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo)
  }

  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `💙━━⊱【Hatsune Miku】⊰━━💙
🚫 Expulsión confirmada.  
🎤 Usuario: @${m.messageStubParameters[0].split`@`[0]}
💔 Fue removido del grupo.
💙 Que el ritmo siga sin interrupciones. 🎵
💙━━⊱【01】⊰━━💙`

    await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
  }

  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `💙━━⊱【Hatsune Miku】⊰━━💙
😢 Adiós, usuario.  
🎤 Usuario: @${m.messageStubParameters[0].split`@`[0]}
💔 Se fue del grupo...
💙 Nunca olvidaremos tu eco. 🎶
💙━━⊱【01】⊰━━💙`

    await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo)
  }
}
