import fetch from 'node-fetch';
import yts from 'yt-search';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Función para descargar con yt-dlp
const downloadWithYtDlp = async (url, format) => {
  try {
    const { stdout, stderr } = await execAsync(
      `yt-dlp -x --audio-format ${format} -o "downloads/%(title)s.%(ext)s" ${url}`
    );

    if (stderr) {
      console.error(`Error en yt-dlp: ${stderr}`);
      return null;
    }

    const outputFile = stdout.match(/\[download\] Destination: (.*)/)[1];
    return outputFile;
  } catch (error) {
    console.error(`Error ejecutando yt-dlp: ${error}`);
    return null;
  }
};

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
          // Intentar descargar audio con la API
          try {
            const apiAud = await fetch(`https://api.agungny.my.id/api/youtube-audio?url=https://youtu.be/${videoId}`);
            const dataAud = await apiAud.json();

            if (dataAud.result?.downloadUrl) {
              await conn.sendMessage(UC, {
                audio: { url: dataAud.result.downloadUrl },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
                ptt: false
              }, { quoted: RM });
            } else {
              throw new Error('No se pudo obtener el enlace de descarga del audio.');
            }
          } catch (apiError) {
            console.error('Error con la API de audio:', apiError);
            // Intentar descargar con yt-dlp como respaldo
            const audioFile = await downloadWithYtDlp(`https://youtu.be/${videoId}`, 'mp3');
            if (audioFile) {
              await conn.sendMessage(UC, {
                audio: { url: `file://${audioFile}` },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
                ptt: false
              }, { quoted: RM });
            } else {
              await conn.reply(UC, '💙 No se pudo descargar el audio.', RM);
            }
          }
        } else if (UR === '2') {
          // Intentar descargar video con la API
          try {
            const apiVid = await fetch(`https://api.agungny.my.id/api/youtube-video?url=https://youtu.be/${videoId}`);
            const dataVid = await apiVid.json();

            if (dataVid.result?.downloadUrl) {
              await conn.sendMessage(UC, {
                video: { url: dataVid.result.downloadUrl },
                caption: `💙 ¡Disfruta tu video!`,
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`
              }, { quoted: RM });
            } else {
              throw new Error('No se pudo obtener el enlace de descarga del video.');
            }
          } catch (apiError) {
            console.error('Error con la API de video:', apiError);
            // Intentar descargar con yt-dlp como respaldo
            const videoFile = await downloadWithYtDlp(`https://youtu.be/${videoId}`, 'mp4');
            if (videoFile) {
              await conn.sendMessage(UC, {
                video: { url: `file://${videoFile}` },
                caption: `💙 ¡Disfruta tu video!`,
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`
              }, { quoted: RM });
            } else {
              await conn.reply(UC, '💙 No se pudo descargar el video.', RM);
            }
          }
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
