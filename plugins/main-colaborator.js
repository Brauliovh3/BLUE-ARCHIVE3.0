let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Rafael;;\nFN:Rafael\nORG:Rafael⁩\nTITLE:\nitem1.TEL;waid=51939508653:51939508653\nitem1.X-ABLabel:Rafael⁩\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Rafael\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Rafael⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['colaborator']
handler.tags = ['main']
handler.command = ['colab', 'colaborator', 'colaborador', 'ayudante'] 

export default handler
