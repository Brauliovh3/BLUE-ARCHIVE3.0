import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
let res = await fetch('https://api.github.com/repos/Brauliovh3/Hatsune_Miku_2.0')
let json = await res.json()
try {
let txt = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸                                     KIVOTOS ACADEMY                                              🌸┃
┃💙                               INFORMACIÓN DEL REPOSITORIO                                       💙┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║📊                                  DATOS DEL PROYECTO                                            �║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════╣
║🎯 Nombre del Proyecto: ${json.name}                                                              ║
║⭐ Estrellas en GitHub: ${json.stargazers_count}                                                  ║
║�️ Visualizaciones: ${json.watchers_count}                                                       ║
║� Tamaño del Proyecto: ${(json.size / 1024).toFixed(2)} MB                                      ║
║🔄 Forks Realizados: ${json.forks_count}                                                         ║
║� Última Actualización: ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}              ║
║🌐 URL del Repositorio: ${json.html_url}                                                         ║
║🏫 Desarrollado por: Millennium Science School                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝

🌸 *Mensaje de Tachibana Nozomi:*
"¡Como presidenta del Club de Ingeniería, me enorgullece presentar nuestro proyecto más ambicioso! Este bot representa la culminación de todo nuestro conocimiento tecnológico aplicado para crear la mejor experiencia estudiantil en Kivotos."

💙 *Características Destacadas:*
▸ Sistema Multi-Dispositivo avanzado
▸ Inteligencia Artificial integrada
▸ Interfaz temática de Blue Archive
▸ Actualizaciones constantes y mejoras

> � *${textbot}*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🎀                          🌟 Millennium Science School Engineering 🌟                           🎀┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
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