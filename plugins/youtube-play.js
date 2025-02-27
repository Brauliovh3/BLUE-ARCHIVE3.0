import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
  // Verifica si se proporcionó un texto
  if (!text) return conn.reply(m.chat, '💙 Ingresa el nombre de la canción o video que deseas buscar.', m);

  try {
    // Buscar el video en YouTube
    let res = await search(text);
    if (!res || res.length === 0) return conn.reply(m.chat, '💙 No se encontraron resultados para tu búsqueda.', m);

    // Obtener detalles del primer resultado
    const { title, thumbnail, timestamp, views, ago, videoId } = res[0];

    // Mensaje con corazones azules
    let txt = `💙 *[ YOUTUBE - PLAY ]*\n\n`
            + `💙 *Título:* ${title}\n`
            + `💙 *Duración:* ${timestamp}\n`
            + `💙 *Visitas:* ${views}\n`
            + `💙 *Subido:* ${ago}\n\n`
            + `💙 Responde a este mensaje con:\n`
            + `1: Audio\n`
            + `2: Video`;

    // Enviar el mensaje con la miniatura del video
    let SM = await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m);

    // Escuchar la respuesta del usuario
    conn.ev.on("messages.upsert", async (upsertedMessage) => {
      let RM = upsertedMessage.messages[0];
      if (!RM.message) return;

      const UR = RM.message.conversation || RM.message.extendedTextMessage?.text;
      let UC = RM.key.remoteJid;

      // Verificar si la respuesta es para este mensaje
      if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id) {
        if (UR === '1') {
          // Obtener enlace de audio
          const apiAud = await fetch(`https://api.agungny.my.id/api/youtube-audio?url=https://youtu.be/${videoId}`);
          const dataAud = await apiAud.json();

          // Enviar audio
          await conn.sendMessage(UC, {
            audio: { url: dataAud.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            ptt: false
          }, { quoted: RM });
        } else if (UR === '2') {
          // Obtener enlace de video
          const apiVid = await fetch(`https://api.agungny.my.id/api/youtube-video?url=https://youtu.be/${videoId}`);
          const dataVid = await apiVid.json();

          // Enviar video
          await conn.sendMessage(UC, {
            video: { url: dataVid.result.downloadUrl },
            caption: `💙 ¡Disfruta tu video!`,
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
          }, { quoted: RM });
        } else {
          // Opción inválida
          await conn.sendMessage(UC, { text: "💙 Opción inválida. Responde con 1 *(audio)* o 2 *(video)*." }, { quoted: RM });
        }
      }
    });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '💙 Ocurrió un error al procesar tu solicitud.', m);
  }
};

// Registrar el comando
handler.command = ["play"];
handler.help = ["play <canción>"];
handler.tags = ["downloader"];

export default handler;

// Función para buscar videos en YouTube
async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}
