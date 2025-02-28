import fetch from 'node-fetch';
import yts from 'yt-search';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const downloadFolder = '/tmp'; // Usar el directorio temporal


if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
}


const sanitizeFilename = (filename) => {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-') // Reemplazar caracteres no permitidos
    .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
    .substring(0, 100); // Limitar la longitud del nombre
};

// APIs para descargar audio y video
const audioApis = [
  { url: (videoUrl) => fetch(`https://api.neoxr.eu/api/youtube?url=${videoUrl}&type=audio&quality=128kbps&apikey=GataDios`).then(res => res.json()), extract: (data) => data.data.url },
  { url: (videoUrl) => fetch(`https://api.fgmods.xyz/api/downloader/ytmp3?url=${videoUrl}&apikey=${fgkeysapi}`).then(res => res.json()), extract: (data) => data.result.dl_url },
  { url: (videoUrl) => fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${videoUrl}`).then(res => res.json()), extract: (data) => data.dl },
  { url: (videoUrl) => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${videoUrl}`).then(res => res.json()), extract: (data) => data.result.download.url }
];

const videoApis = [
  { url: (videoUrl) => fetch(`https://api.neoxr.eu/api/youtube?url=${videoUrl}&type=video&quality=720p&apikey=GataDios`).then(res => res.json()), extract: (data) => data.data.url },
  { url: (videoUrl) => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${videoUrl}&apikey=${fgkeysapi}`).then(res => res.json()), extract: (data) => data.result.dl_url },
  { url: (videoUrl) => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${videoUrl}`).then(res => res.json()), extract: (data) => data.dl },
  { url: (videoUrl) => fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${videoUrl}`).then(res => res.json()), extract: (data) => data.result.media.mp4 }
];

// Función para descargar usando las APIs
const downloadWithAPI = async (videoUrl, isAudio = true) => {
  const apis = isAudio ? audioApis : videoApis;
  for (const api of apis) {
    try {
      const response = await api.url(videoUrl);
      const downloadUrl = api.extract(response);
      if (downloadUrl) {
        return downloadUrl;
      }
    } catch (error) {
      console.error(`Error con API: ${error}`);
    }
  }
  return null;
};


const downloadAndSendWithAPI = async (conn, chatId, replyMsg, videoId, isAudio, title) => {
  try {
    await conn.reply(chatId, `💙 Descargando ${isAudio ? 'audio' : 'video'}, por favor espera...`, replyMsg);

    
    const videoUrl = `https://youtu.be/${videoId}`;
    const downloadUrl = await downloadWithAPI(videoUrl, isAudio);

    if (!downloadUrl) {
      await conn.reply(chatId, `💙 No se pudo descargar el ${isAudio ? 'audio' : 'video'}. Intenta más tarde.`, replyMsg);
      return false;
    }

   
    const buffer = await downloadToBuffer(downloadUrl);
    if (!buffer) {
      await conn.reply(chatId, `💙 El archivo descargado parece estar corrupto. Intenta más tarde.`, replyMsg);
      return false;
    }

    
    const sanitizedTitle = sanitizeFilename(title);
    const tempFilePath = path.join(downloadFolder, `${sanitizedTitle}.${isAudio ? 'mp3' : 'mp4'}`);

    
    fs.writeFileSync(tempFilePath, buffer);

    
    if (isAudio) {
      await conn.sendMessage(chatId, {
        audio: fs.readFileSync(tempFilePath), 
        mimetype: "audio/mpeg",
        fileName: `${sanitizedTitle}.mp3`,
        ptt: false
      }, { quoted: replyMsg });
    } else {
      await conn.sendMessage(chatId, {
        video: fs.readFileSync(tempFilePath), 
        caption: `💙 ¡Disfruta tu video!`,
        mimetype: 'video/mp4',
        fileName: `${sanitizedTitle}.mp4`
      }, { quoted: replyMsg });
    }

    
    setTimeout(() => {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`Archivo eliminado: ${tempFilePath}`);
      } catch (err) {
        console.error(`Error al eliminar archivo: ${err}`);
      }
    }, 10000); 

    return true;
  } catch (error) {
    console.error('Error descargando con API:', error);
    await conn.reply(chatId, `💙 Ocurrió un error al procesar tu solicitud. Intenta más tarde.`, replyMsg);
    return false;
  }
};


const downloadToBuffer = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) < 10000) { // Menos de 10KB
      throw new Error('Archivo demasiado pequeño, posiblemente corrupto');
    }

    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error('Error descargando a buffer:', error);
    return null;
  }
};


let handler = async (m, { conn, text }) => {
  
  if (!text) return conn.reply(m.chat, '💙 Ingresa el nombre de la canción o video que deseas buscar.', m);

  try {
    
    let res = await search(text);
    if (!res || res.length === 0) return conn.reply(m.chat, '💙 No se encontraron resultados para tu búsqueda.', m);

    
    const { title, thumbnail, timestamp, views, ago, videoId } = res[0];

    
    let txt = `💙 *[ YOUTUBE - PLAY ] *\n\n`
            + `💙 *Título:* ${title}\n`
            + `💙 *Duración:* ${timestamp}\n`
            + `💙 *Visitas:* ${views}\n`
            + `💙 *Subido:* ${ago}\n\n`
            + `💙 Responde a este mensaje con:\n`
            + `1: Audio\n`
            + `2: Video`;

    // Enviar el mensaje con la miniatura del video
    let SM = await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m);

    
    const handleOnce = new Set();

    
    conn.ev.on("messages.upsert", async (upsertedMessage) => {
      let RM = upsertedMessage.messages[0];
      if (!RM.message) return;

      const UR = RM.message.conversation || RM.message.extendedTextMessage?.text;
      let UC = RM.key.remoteJid;
      const msgId = RM.key.id;

     
      if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id && !handleOnce.has(msgId)) {
        // Marcar como procesado
        handleOnce.add(msgId);

        if (UR === '1') {
          
          await downloadAndSendWithAPI(conn, UC, RM, videoId, true, title);
        } else if (UR === '2') {
          
          await downloadAndSendWithAPI(conn, UC, RM, videoId, false, title);
        } else {
         
          await conn.sendMessage(UC, { text: "💙 Opción inválida. Responde con 1 *(audio)* o 2 *(video)*." }, { quoted: RM });
        }
      }
    });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '💙 Ocurrió un error al procesar tu solicitud.', m);
  }
};


handler.command = ["play"];
handler.help = ["play <canción>"];
handler.tags = ["downloader"];
export default handler;


async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}
