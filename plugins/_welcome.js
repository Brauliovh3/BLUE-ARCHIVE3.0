import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://media.tenor.com/if2-iI3keS0AAAAe/tachibana-nozomi-nozomi.png')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `💚━━⊱ *${botname}* ⊰━━💚 \n🌟 *¡Bienvenid@!* 🌟\n🎤 *Usuario:@${m.messageStubParameters[0].split`@`[0]} \n  🎶 *Grupo: ${groupMetadata.subject}\n💚 *¡Que la compañia te ayude!* 🎵 \n   💚━━⊱【🖨】⊰━━💚`
    
await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `💚━━⊱ *${botname}* ⊰━━💚 \n🚫 *Expulsión confirmada.\n🎤 *Usuario: @${m.messageStubParameters[0].split`@`[0]} \n  💔 *Fue removido del grupo.\n   💚 *Que el tren siga sin interrupciones.\n   💚━━⊱【🖨】⊰━━💚`
await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `💚━━⊱ *${botname}* ⊰━━💚 \n😢 *Adiós, usuario.*\n🎤 *Usuario:「 @${m.messageStubParameters[0].split`@`[0]} \n   💔 *Se fue del grupo...\n   💚 *Nunca te olvidaremos estudiante.* 🎶\n   💚━━⊱【🖨】⊰━━💚`
await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo)
}}
