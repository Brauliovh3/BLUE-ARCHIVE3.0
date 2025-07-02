let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
  try {
    let kickte = `💚🌿 ¡Sensei! Menciona al usuario que deseas remover o responde a su mensaje. Como presidenta del Club de Ingeniería, necesito saber quién debe ser removido de esta operación.`
    
    
    if (!m.mentionedJid[0] && !m.quoted) {
      return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) })
    }
    
    
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    
    
    let participantsList = participants.map(p => p.id)
    if (!participantsList.includes(user)) {
      return m.reply('💚🌿 ¡Sensei! Ese usuario no se encuentra en esta unidad táctica. Nozomi ha verificado la lista de miembros.')
    }
    
    
    if (user === conn.user.jid) {
      return m.reply('💚🌿 ¡Sensei! No puedo removerme a mí misma de la operación. El Club de Ingeniería me necesita aquí para coordinar las actividades. ¡Eso sería contraproducente!')
    }
    
    
    let groupMetadata = await conn.groupMetadata(m.chat)
    if (user === groupMetadata.owner) {
      return m.reply('💚🌿 ¡Sensei! No puedo remover al comandante supremo de esta unidad. Como estratega del Club de Ingeniería, debo respetar la cadena de mando.')
    }
    
    
    let userName = conn.getName(user)
    
    
    const removalMessages = [
      "¡Operación de remoción ejecutada con precisión estratégica!",
      "¡La decisión táctica ha sido implementada exitosamente!",
      "¡El Club de Ingeniería ha procesado la solicitud de transferencia!",
      "¡Protocolo de seguridad de Kivotos activado con éxito!"
    ]
    
    
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    
   
    let successMsg = removalMessages[Math.floor(Math.random() * removalMessages.length)]
    m.reply(`💚🌿 ${successMsg}\n\n*${userName}* ha sido removido de la unidad táctica según las órdenes del Sensei.\n\n"La planificación estratégica siempre debe considerar estos ajustes necesarios." - Nozomi ✨`)
    
    
    try {
      await conn.sendMessage(user, { 
        text: `💚🌿 Estimado estudiante, has sido transferido fuera de la unidad táctica *${groupMetadata.subject}* por decisión administrativa.\n\n"No lo tomes personal, son ajustes estratégicos necesarios para el funcionamiento óptimo del grupo." - Nozomi, Club de Ingeniería 🌱` 
      })
    } catch (error) {
      console.log('No se pudo enviar mensaje privado al usuario expulsado:', error)
    }
    
  } catch (error) {
    console.error('Error en comando kick:', error)
    m.reply('💚🌿 ¡Oh no, Sensei! Ocurrió un error durante la operación de remoción. Como estratega del Club de Ingeniería, recomiendo verificar que tengas los permisos administrativos necesarios para esta acción.')
  }
}

handler.help = ['kick *@user*', 'expulsar *@user*']
handler.tags = ['group']
handler.command = ['kick', 'expulsar', 'echar', 'remover'] 
handler.admin = true
handler.group = true
handler.Admin = true

export default handler
