import ws from 'ws';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
   
    let uniqueUsers = new Map();
    
    
    if (!global.conns || !Array.isArray(global.conns)) {
      global.conns = [];
    }
    
    
    global.conns.forEach((conn) => {
      if (conn.user && conn.user.jid && conn.ws?.socket?.readyState !== ws.CLOSED) {
        uniqueUsers.set(conn.user.jid, conn.user);
      }
    });
    
    
    let totalUsers = uniqueUsers.size;
    
    
    const subbotList = Array.from(uniqueUsers.values()).map((user, index) => {
     
      if (!user || !user.jid) return `┌  💙  ${index + 1} : Error - Sin JID\n└  💙  Nombre : Desconocido`;
      
      const phoneNumber = user.jid.replace(/[^0-9]/g, '');
      return `┌  💙  ${index + 1} : @${phoneNumber}
│  🎤  Link : http://wa.me/${phoneNumber}
└  💙  Nombre : ${user.name || 'Hatsune Miku'}`;
    }).join('\n\n');
    
   
    const statusMessage = `–  *S E R B O T  -  S U B B O T S*  –
    
💙 *Total Sub-Bots conectados: ${totalUsers || 0}*

${subbotList || "No hay subbots conectados actualmente."}`;
    
   
    try {
      const imageUrl = 'https://c4.wallpaperflare.com/wallpaper/656/695/696/hatsune-miku-chibi-version-dress-vocaloid-wallpaper-preview.jpg'; 
      let img = await (await fetch(imageUrl)).buffer();
      await conn.sendFile(
        m.chat, 
        img, 
        'thumbnail.jpg', 
        statusMessage, 
        m, 
        false, 
        { mentions: conn.parseMention(statusMessage) }
      );
    } catch (imageError) {
      console.log('Error al cargar la imagen:', imageError);
     
      await conn.reply(m.chat, statusMessage, m, { mentions: conn.parseMention(statusMessage) });
    }
  } catch (error) {
    console.error('Error en el handler de listjadibot:', error);
    await conn.reply(m.chat, '💙 Ocurrió un error al listar los subbots', m, rcanal);
  }
};

handler.command = ['listjadibot', 'bots', 'subbots'];
handler.help = ['bots', 'subbots'];
handler.tags = ['serbot'];

export default handler;
