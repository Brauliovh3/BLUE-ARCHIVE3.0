let handler = async (m, { conn }) => {
	
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)

let runtimeMsg = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🌸                                     KIVOTOS ACADEMY                                              🌸┃
┃💙                                   SISTEMA DE MONITOREO                                          💙┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

╔═══════════════════════════════════════╗
║⏰       TIEMPO DE ACTIVIDAD     ⏰║
╠═══════════════════════════════════════╣
║🤖 Sistema: Tachibana Nozomi Bot     ║
║🏫 Academia: Millennium Science      ║
║⭐ Estado: Operativo                 ║
║🌸 Activo: ${uptime}                               ║
║💙 Fecha: ${new Date().toLocaleDateString('es-ES')}║
║🕐 Hora: ${new Date().toLocaleTimeString('es-ES', { hour12: false })}║
╚═══════════════════════════════════════╝

🌸 *Mensaje de Tachibana Nozomi:*
"¡Como presidenta del Club de Ingeniería, me complace informar que todos nuestros sistemas están funcionando perfectamente! El bot ha estado operativo sin interrupciones."

💙 *Estado:* ✅ **ESTABLE Y CONFIABLE**

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃💙                            🌟 Sistema estable y confiable 🌟                                    💙┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`

m.reply(runtimeMsg)
	
}

handler.help = ['runtime']
handler.tags = ['main']
handler.command = ['runtime', 'uptime']

export default handler

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return `${d}d ${h}h ${m}m ${s}s`
}
