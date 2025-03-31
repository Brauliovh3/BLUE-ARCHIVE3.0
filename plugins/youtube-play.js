import fetch from 'node-fetch';
import yts from 'yt-search';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);
const downloadFolder = './descargas'; 
const MAX_SIZE_MB = 100; 

if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
}

const sanitizeFilename = (filename) => {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-') 
    .replace(/\s+/g, '_') 
    .substring(0, 100); 
};

const getFileSize = async (url) => {
  try {
    const response = await axios.head(url);
    const sizeInBytes = response.headers['content-length'] || 0;
    return parseFloat((sizeInBytes / (1024 * 1024)).toFixed(2));
  } catch (error) {
    console.error("Error obteniendo el tamaño del archivo:", error);
    return 0;
  }
};

const fetchAPI = async (url, type) => {
  
  const audioEndpoints = [
    {
      url: async () => {
        const response = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.result.download.url
    },
    {
      url: async () => {
        const response = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.dl
    },
    {
      url: async () => {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=audio&apikey=GataDios`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.data.url
    },
    {
      url: async () => {
        const response = await fetch(`${global.APIs?.fgmods?.url || 'https://api-fgmods.ddns.net'}/downloader/ytmp3?url=${url}&apikey=${global.APIs?.fgmods?.key || 'fg-dylux'}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.result?.dl_url
    }
  ];

  
  const videoEndpoints = [
    {
      url: async () => {
        const response = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.result.download.url
    },
    {
      url: async () => {
        const response = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.dl
    },
    {
      url: async () => {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=720p&apikey=GataDios`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.data.url
    },
    {
      url: async () => {
        const response = await fetch(`${global.APIs?.fgmods?.url || 'https://api-fgmods.ddns.net'}/downloader/ytmp4?url=${url}&apikey=${global.APIs?.fgmods?.key || 'fg-dylux'}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.result?.dl_url
    },
    {
      url: async () => {
        const response = await fetch(`${global.APIs?.apis || 'https://api.boxmine.xyz'}/download/ytmp4?url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.status ? data.data.download.url : null
    },
    {
      url: async () => {
        const response = await fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${url}`);
        const data = await response.json();
        return data;
      },
      extract: (data) => data.result?.media?.mp4
    }
  ];

  const endpoints = type === 'audio' ? audioEndpoints : videoEndpoints;

  
  for (const endpoint of endpoints) {
    try {
      const data = await endpoint.url();
      const downloadUrl = endpoint.extract(data);
      
      if (downloadUrl) {
        return { download: downloadUrl };
      }
    } catch (error) {
      console.error(`Error con endpoint:`, error);
      
    }
  }

 
  return { download: null };
};

const compressFile = async (filePath, isAudio) => {
  const compressedFilePath = filePath.replace(/\.[^/.]+$/, `_compressed${isAudio ? '.mp3' : '.mp4'}`);
  const command = isAudio
    ? `ffmpeg -i ${filePath} -b:a 128k ${compressedFilePath}`
    : `ffmpeg -i ${filePath} -vf scale=640:360 -b:v 1000k ${compressedFilePath}`;
  await execAsync(command);
  return compressedFilePath;
};

const sendFromUrl = async (conn, chatId, url, isAudio, title, replyMsg) => {
  const sanitizedTitle = sanitizeFilename(title);
  const fileName = `${sanitizedTitle}.${isAudio ? 'mp3' : 'mp4'}`;

  await conn.sendMessage(chatId, {
    [isAudio ? 'audio' : 'video']: { url },
    mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
    fileName,
    caption: `💙 ¡Disfruta tu ${isAudio ? 'audio' : 'video'}!`
  }, { quoted: replyMsg });
};

const sendAsDocument = async (conn, chatId, url, isAudio, title, replyMsg) => {
  const sanitizedTitle = sanitizeFilename(title);
  const fileName = `${sanitizedTitle}.${isAudio ? 'mp3' : 'mp4'}`;

  await conn.sendMessage(chatId, {
    document: { url },
    mimetype: isAudio ? 'audio/mpeg' : 'video/mp4',
    fileName,
    caption: `💙 ${isAudio ? 'Audio' : 'Video'} descargado como documento`
  }, { quoted: replyMsg });
};

const downloadAndSendWithAPI = async (conn, chatId, replyMsg, videoId, isAudio, title, asDocument = false) => {
  try {
    await conn.reply(chatId, `💙 Descargando ${isAudio ? 'audio' : 'video'}${asDocument ? ' como documento' : ''}, por favor espera...`, replyMsg);

    const videoUrl = `https://youtu.be/${videoId}`;
    const apiResponse = await fetchAPI(videoUrl, isAudio ? 'audio' : 'video');
    const downloadUrl = apiResponse.download;

    if (!downloadUrl) {
      await conn.reply(chatId, `💙 No se pudo descargar el ${isAudio ? 'audio' : 'video'}. Intenta más tarde.`, replyMsg);
      return false;
    }

    const fileSizeMB = await getFileSize(downloadUrl);

    if (fileSizeMB > MAX_SIZE_MB && !asDocument) {
      await conn.reply(chatId, `💙 El archivo es demasiado grande (${fileSizeMB}MB). Se enviará como documento.`, replyMsg);
      await sendAsDocument(conn, chatId, downloadUrl, isAudio, title, replyMsg);
    } else if (asDocument) {
      await sendAsDocument(conn, chatId, downloadUrl, isAudio, title, replyMsg);
    } else {
      await sendFromUrl(conn, chatId, downloadUrl, isAudio, title, replyMsg);
    }

    return true;
  } catch (error) {
    console.error('Error descargando con API:', error);
    await conn.reply(chatId, `💙 Ocurrió un error al procesar tu solicitud. Intenta más tarde.`, replyMsg);
    return false;
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '💙 Ingresa el nombre de la canción o video que deseas buscar.', m);

  try {
    let res = await search(text);
    if (!res || res.length === 0) return conn.reply(m.chat, '💙 No se encontraron resultados para tu búsqueda.', m);

    const { title, thumbnail, timestamp, views, ago, videoId } = res[0];

    let txt = `💙 [ YOUTUBE - PLAY ] 💙\n\n`
            + `💙 *Título:* ${title}\n`
            + `💙 *Duración:* ${timestamp}\n`
            + `💙 *Visitas:* ${views}\n`
            + `💙 *Subido:* ${ago}\n\n`
            + `💙 *Responde a este mensaje con:*\n`
            + `1: Audio\n`
            + `2: Video\n`
            + `3: Audio como Documento\n`
            + `4: Video como Documento`;

    let SM = await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m);
    
    
    await conn.sendMessage(m.chat, { react: { text: '🎤', key: SM.key } });

    const handleOnce = new Set();

    conn.ev.on("messages.upsert", async (upsertedMessage) => {
      let RM = upsertedMessage.messages[0];
      if (!RM.message) return;

      const UR = RM.message.conversation || RM.message.extendedTextMessage?.text;
      let UC = RM.key.remoteJid;
      const msgId = RM.key.id;

      if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id && !handleOnce.has(msgId)) {
        handleOnce.add(msgId);
        
        
        await conn.sendMessage(UC, { react: { text: '⏳', key: RM.key } });

        if (UR === '1') {
          await downloadAndSendWithAPI(conn, UC, RM, videoId, true, title);
          await conn.sendMessage(UC, { react: { text: '🎵', key: RM.key } });
        } else if (UR === '2') {
          await downloadAndSendWithAPI(conn, UC, RM, videoId, false, title);
          await conn.sendMessage(UC, { react: { text: '🎬', key: RM.key } });
        } else if (UR === '3') {
          await downloadAndSendWithAPI(conn, UC, RM, videoId, true, title, true);
          await conn.sendMessage(UC, { react: { text: '📎', key: RM.key } });
        } else if (UR === '4') {
          await downloadAndSendWithAPI(conn, UC, RM, videoId, false, title, true);
          await conn.sendMessage(UC, { react: { text: '📎', key: RM.key } });
        } else {
          await conn.sendMessage(UC, { text: "💙 Opción inválida. Responde con 1 *(audio)*, 2 *(video)*, 3 *(audio documento)* o 4 *(video documento)*." }, { quoted: RM });
          await conn.sendMessage(UC, { react: { text: '❌', key: RM.key } });
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
