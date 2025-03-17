import { setTimeout } from 'node:timers/promises'

export const onlyClean = true

export default {
  all: true,
  tags: ['filtros', 'administracion'],
  help: ['antitoxic', 'antigroserías'],
  handler: async function (m, { isAdmin, isBotAdmin, conn }) {
    if (!m.isGroup) return false
    
    let chat = global.db.data.chats[m.chat]
    if (!chat.antiToxic) return false
    if (isAdmin && chat.exemptAdmin) return false
    
    const toxicWords = [
      'puta', 'mierda', 'cabrón', 'cabron', 'hdp', 'hijo de puta',
      'pendejo', 'chinga', 'verga', 'joder', 'joto', 'maricon',
      'marica', 'gilipollas', 'idiota', 'imbécil', 'imbecil',
      'puto', 'cago', 'caga', 'ctm', 'concha', 'coño',
      'carajo', 'pinche', 'culero', 'chinga tu madre', 'chucha',
      'conchudo', 'estúpido', 'estupido', 'huevon', 'malparido',
      'gonorrea', 'follar', 'chingada', 'jodete', 'panocha'
    ]
    
    const regex = new RegExp(`(${toxicWords.join('|')})`, 'i')
    
    // Normalización
    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .replace(/[^a-zA-Zñáéíóúü0-9\s]/g, '') // elimina signos
        .replace(/\s+/g, ' ') // elimina espacios múltiples
    }

    if (m.text) {
      const clean = normalizeText(m.text)
      const spaced = clean.replace(/\s/g, '')
      
      if (regex.test(clean) || regex.test(spaced)) {
        const warningMsg = `
╭─────❬ 💙 ❭─────╮
│ *¡Lenguaje Detectado!* 
│ 
│ 💠 @${m.sender.split('@')[0]}
│ 💠 Por favor cuida tu
│ 💠 vocabulario en el grupo
│ 
│ 💙 Mantengamos un ambiente
│ 💙 respetuoso para todos
╰─────❬ 💙 ❭─────╯
`.trim()
        
        await conn.reply(m.chat, warningMsg, m, {
          mentions: [m.sender]
        })
        
        let user = global.db.data.users[m.sender]
        if (!user.toxicWarns) user.toxicWarns = 0
        user.toxicWarns++
        
        if (chat.deleteToxic && isBotAdmin) {
          await setTimeout(1000)
          await conn.sendMessage(m.chat, { delete: m.key })
        }
        
        if (chat.toxicLimit && user.toxicWarns >= chat.toxicLimit && isBotAdmin) {
          user.toxicWarns = 0
          
          const kickMsg = `
╭─────❬ 💠 ❭─────╮
│ *Usuario Expulsado* 
│ 
│ 💙 @${m.sender.split('@')[0]} ha sido
│ 💙 expulsado por exceder el
│ 💙 límite de advertencias
│ 
│ 💠 Motivo: Lenguaje ofensivo
│ 💠 Advertencias: ${chat.toxicLimit}/${chat.toxicLimit}
╰─────❬ 💠 ❭─────╯
`.trim()
          
          await conn.reply(m.chat, kickMsg, null, {
            mentions: [m.sender]
          })
          
          await setTimeout(1000)
          await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        
        return true
      }
    }
    
    return false
  }
}
