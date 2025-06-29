let handler = async (m, { conn, usedPrefix, command}) => {
    let pp = 'https://tinyurl.com/28b8j9m7'
    let pp2 = 'https://tinyurl.com/263szwef'
    let who
    if (!global.db.data.chats[m.chat].nsfw) return conn.reply(m.chat, `💚 El grupo no admite contenido *Nsfw.*\n\n> Para activarlo un *Administrador* debe usar el comando */on nfsw*`, m, rcanal)
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) return conn.reply(m.chat, '💚 Menciona al usuario con *@user*', m, rcanal)
    let name2 = conn.getName(who)
    let name = conn.getName(m.sender)
    
    await conn.sendMessage(m.chat, { video: { url: [pp, pp2].getRandom() }, gifPlayback: true, caption: `*${name}*` + 'Esta follando🍆🥒 a' + ` *${name2}*` + ' 💦💦 *:・ﾟ✧' }, { quoted: m })
    }
    handler.help = ['follar *<@user>*']
    handler.tags = ['game']
    handler.command = ['cum', 'follar']
    export default handler
