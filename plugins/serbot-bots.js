import ws from 'ws'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
   let uniqueUsers = new Map()

   if (!global.conns || !Array.isArray(global.conns)) {
     global.conns = []
   }

   global.conns.forEach((conn) => {
     if (conn.user && conn.ws?.socket?.readyState !== ws.CLOSED) {
       uniqueUsers.set(conn.user.jid, conn.user)
     }
   })

   let totalUsers = uniqueUsers.size
   let message = Array.from(uniqueUsers.values()).map((user, index) => 
     `┌ 💙 *${index + 1}* : @${user.jid.replace(/[^0-9]/g, '')}
│ 🎤 *Link* : http://wa.me/${user.jid.replace(/[^0-9]/g, '')}
└ 💙 *Nombre* : ${user.name || 'Hatsune Miku'}
`
   ).join('\n')

   let txt = `*💙 Total Sub-Bots* » *${totalUsers || 0}*\n\n${message}`.trim()

   let imgUrl = 'https://c4.wallpaperflare.com/wallpaper/656/695/696/hatsune-miku-chibi-version-dress-vocaloid-wallpaper-preview.jpg'
   let img = await (await fetch(imgUrl)).buffer()

   await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, false, { mentions: conn.parseMention(txt) })
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler
