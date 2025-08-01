import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://media.tenor.com/if2-iI3keS0AAAAe/tachibana-nozomi-nozomi.png')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  
  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `💚═════◆【 KIVOTOS 】◆════💚
🌸 ¡Un nuevo estudiante ha llegado! 🌸
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💚 Estudiante: @${m.messageStubParameters[0].split`@`[0]}
┃ 🏫 Escuela: ${groupMetadata.subject}
┃ 📚 Estado: ¡Matriculado exitosamente!
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
🎀 ¡Bienvenido a nuestro club de actividades! 🎀
💚 Nozomi espera que disfrutes tu tiempo aquí~ ✨
🌿 ¡Que tengas una experiencia académica increíble! 🌿
🎆Sigue nuestro canal🚂
💙https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o 
💚═════◆【 🎓 】◆═════💚`
    
    await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `💚══════◆【 KIVOTOS 】◆══════💚
🚫 ¡Acción disciplinaria ejecutada! 🚫
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💔 Estudiante: @${m.messageStubParameters[0].split`@`[0]}
┃ 📋 Motivo: Expulsión del grupo
┃ 🏫 Estado: Removido de la escuela
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
😔 Las reglas escolares deben ser respetadas...
💚 Esperamos que reflexiones sobre tus acciones 🌿
🎓 La disciplina es parte del crecimiento estudiantil
🎆Sigue nuestro canal🚂
💙https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o
💚═══════◆【 ⚖️ 】◆═══════💚`
    
    await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸  KIVOTOS ACADEMY     🌸┃
┃💫TRANSFERENCIA ESTUDIANTIL💫┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🌸 *Un estudiante ha decidido seguir su propio camino...* 🌸

╔════════════════════════════╗
║🎓 REPORTE DE TRANSFERENCIA 🎓║
╠════════════════════════════════╣
║� Estudiante: @${m.messageStubParameters[0].split`@`[0]}║
║� Escuela Origen: Millennium Science School║
║🎯 Motivo: Transferencia Voluntaria║
║� Fecha de Partida: ${new Date().toLocaleDateString('es-ES')}║
║� Hora: ${new Date().toLocaleTimeString('es-ES', { hour12: false })}║
║💫 Estado: Siguiendo nueva aventura║
╚════════════════════════════════╝

🌸 *Mensaje de despedida de Tachibana Nozomi:*
💙 "Aunque es triste ver partir a un compañero, entiendo que cada estudiante debe seguir su propio camino. Como presidenta del Club de Ingeniería, quiero desearte lo mejor en tu nueva aventura. ¡Siempre serás bienvenido/a de vuelta a Kivotos!"

💫 *RECUERDOS ETERNOS:*
▸ Los momentos compartidos en la academia nunca se olvidan
▸ Cada experiencia en Kivotos forma parte de tu crecimiento
▸ Las amistades verdaderas trascienden las fronteras
▸ ¡Te deseamos éxito en todos tus proyectos futuros!

🌟 *Canal Oficial (siempre abierto para ti):*
💙 https://whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸 "¡Que tengas éxito en tu nuevo viaje académico!" �┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    
    await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo)
  }
}
