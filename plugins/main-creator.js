let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;(ㅎㅊDEPOOLㅊㅎ);;\nFN:(ㅎㅊDEPOOLㅊㅎ)⁩\nORG:(ㅎㅊDEPOOLㅊㅎ)⁩\nTITLE:\nitem1.TEL;waid=51988514570:51988514570\nitem1.X-ABLabel:(ㅎㅊDEPOOLㅊㅎ)⁩\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:(ㅎㅊDEPOOLㅊㅎ)\nEND:VCARD`
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Fernando;;\nFN:Fernando⁩\nORG:Fernando\nTITLE:\nitem1.TEL;waid=51963869948:51963869948\nitem1.X-ABLabel:Fernando\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Fernando\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: '(ㅎㅊDEPOOLㅊㅎ)⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner,colaborador']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño','colab','colaborador'] 

export default handler
