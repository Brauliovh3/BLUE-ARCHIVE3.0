import Starlights from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch'
import { ytdl_han } from 'ytdl-han'

const limit = 100

let handler = async (m, { conn, args, usedPrefix, command }) => {
 if (!args[0]) return conn.reply(m.chat, '💙 Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m)
await m.react('🕓')
try {
var gi = await ytdl_han(args[0], "128kbps") 
var base64 = Buffer.from(gi.data.format, 'base64')
if (parseFloat(gi.data.size.split('MB')[0]) >= limit) return m.reply(`El archivo pesa más de ${limit} MB, se canceló la descarga.`).then(() => m.react('✖️'))    
let txt = '`💙  Y O U T U B E  -  M P 3  💙`\n\n' +
`    💙   *Título* : ${gi.data.title}\n` +
`    💙   *Calidad* : 128kbps\n` +
`    💙   *Tamaño* : ${gi.data.size}\n\n` +
'> *- 🌱 El audio se está enviando, espera un momento...*'
await conn.sendFile(m.chat, gi.data.thumbnail, 'thumbnail.jpg', txt, m)
await conn.sendMessage(m.chat, { audio: base64, mimetype: 'audio/mpeg', fileName: `${gi.data.title}.mp3` }, { quoted: m })
await m.react('✅')
} catch (error) {
try {
await m.react('🕓')
let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp3(args[0])
if (parseFloat(size.split('MB')[0]) >= limit) return m.reply(`El archivo pesa más de ${limit} MB, se canceló la descarga.`).then(() => m.react('✖️'))
let img = await (await fetch(thumbnail)).buffer()
let txt2 = '`💙  Y O U T U B E  -  M P 3  💙`\n\n' +
`    💙   *Título* : ${title}\n` +
`    💙   *Calidad* : ${quality}\n` +
`    💙   *Tamaño* : ${size}\n\n` +
'> *- 🌱 El audio se está enviando, espera un momento...*'
await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt2, m)
await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m })
await m.react('✅')
} catch (error) {
await m.react('✖️')
}}}
handler.help = ['ytmp3 *<link yt>*']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta', 'fgmp3']
handler.register = true
export default handler

//patch
/*import Starlights from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch'

const limit = 100

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) { return conn.reply(m.chat, '💙 Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal)}

await m.react('🕓')
try {
let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp3(args[0])

if (parseFloat(size.split('MB')[0]) >= limit) { return m.reply(`El archivo pesa más de ${limit} MB, se canceló la descarga.`).then(() => m.react('✖️'))}

let img = await (await fetch(thumbnail)).buffer()
let txt = '`💙  Y O U T U B E  -  M P 3  💙`\n\n' +
       `	💙   *Título* : ${title}\n` +
       `	💙   *Calidad* : ${quality}\n` +
       `	💙   *Tamaño* : ${size}\n\n` +
       '> *- 🌱 El audio se está enviando, espera un momento...*'

await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m })
await m.react('✅')
} catch {
await m.react('✖️')
}}
handler.help = ['ytmp3 *<link yt>*']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'yta', 'fgmp3']
handler.register = true

export default handler*/
