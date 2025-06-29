import fetch from 'node-fetch'

let handler = async (m, { conn, args, command, usedPrefix }) => {   
let pp = 'https://files.catbox.moe/ps4qif.mp4'
let pp2 = 'https://files.catbox.moe/1g6hcl.mp4'
let pp3 = 'https://files.catbox.moe/qzsed0.mp4'
let pp4 = 'https://files.catbox.moe/4x2i8x.mp4'
let pp5 = 'https://files.catbox.moe/i02zhp.mp4'
let who
if (!global.db.data.chats[m.chat].nsfw) return conn.reply(m.chat, `💚 El grupo no admite contenido *Nsfw.*\n\n> Para activarlo un *Administrador* debe usar el comando */on nfsw*`, m, rcanal)
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
if (!who) return conn.reply(m.chat, '💚 Menciona al usuario con *@user*', m, rcanal)
let name2 = conn.getName(who)
let name = conn.getName(m.sender)

await conn.sendMessage(m.chat, { video: { url: [pp, pp2, pp3, pp4, pp5].getRandom() }, gifPlayback: true, caption: `*${name}*` + ' Se esta corriendo dentro de' + ` *${name2}*` + '💦💦💦💦' }, { quoted: m })
}
handler.help = ['cum *<@user>*']
handler.tags = ['fun']
handler.command = ['cum','Cum','correrse','Correrse']
export default handler
