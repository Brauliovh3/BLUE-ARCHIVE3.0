import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
let res = await fetch('https://api.github.com/repos/Brauliovh3/Hatsune_Miku_2.0')
let json = await res.json()
try {
let txt = '*`💙  S C R I P T  〤  M A I N  💙`*\n\n'
    txt += `*💙 Nombre* :: ${json.name}\n`
    txt += `*💙 Visitas* :: ${json.watchers_count}\n`
    txt += `*💙 Peso* :: ${(json.size / 1024).toFixed(2)} MB\n`
    txt += `*💙 Actualizado* :: ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`
    txt += `*💙 Url* :: ${json.html_url}\n`
    txt += `*💙 Forks* :: ${json.forks_count}\n`
    txt += `*💙 Stars* :: ${json.stargazers_count}\n\n`
    txt += `> 🌱 *${textbot}*`
let img = await (await fetch(`https://telegra.ph/file/5e7042bf17cde23989e71.jpg`)).buffer()

await conn.sendFile(m.chat, img, 'sc.jpg', txt, m, null, rcanal)
} catch {
await m.react('✖️')
}}
handler.help = ['script']
handler.tags = ['main']
handler.command = ['script', 'sc']
handler.register = true 
export default handler