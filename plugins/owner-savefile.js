import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {
if (!text) return m.reply(`💙 Ingresa la Ruta y el nombre del Archivo junto al comando.`)
try {
if (!m.quoted.text) return m.reply(`💙 Responder al mensaje.`)
let path = `${text}`
await fs.writeFileSync(path, m.quoted.text)
m.reply(`💙 Guardado en *${path}*.`)
} catch {
await m.reply(`💙 Responder al mensaje.`)
}}
handler.command = ["savefile", "savejs", "savecmd"]
handler.tags = ['owner']
handler.help = ['savefile']
handler.rowner = true
export default handler
