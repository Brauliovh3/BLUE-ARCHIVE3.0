import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

// Configuración optimizada de axios
const axiosInstance = axios.create({
  timeout: 30000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('Formato no soportado, verifica la lista de formatos disponibles.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      const response = await axiosInstance.request(config);
      
      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, image: info.image, title, downloadUrl };
      }
      throw new Error('Fallo al obtener los detalles del video.');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await axiosInstance.request(config);
        
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        
        retries++;
        // Reducido el tiempo de espera entre intentos
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Intento ${retries + 1} fallido:`, error);
        if (retries === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Tiempo de espera agotado');
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `💙 Ingresa el nombre de la música a descargar.`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const infoMessage = `💙 *Título:* ${title}\n> *Duración:* ${timestamp}\n> *Vistas:* ${vistas}\n> *Canal:* ${videoInfo.author.name || 'Desconocido'}\n> *Publicado:* ${ago}\n> *Enlace:* ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: 'Hatsune Miku',
          body: 'Toma no soy tu esclaba :"|',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (command === 'play') {
      const api = await ddownr.download(url, 'mp3');
      const result = api.downloadUrl;
      await conn.sendMessage(m.chat, { audio: { url: result }, mimetype: "audio/mpeg" }, { quoted: m });

    } else if (command === 'play2' || command === 'ytmp4') {
      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();
          let downloadUrl = json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: '💙 ¡Disfruta tu video!',
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`Error con la fuente ${source}:`, e.message);
          continue;
        }
      }

      if (!success) {
        return m.reply(`💙 *No se pudo descargar el video:* No se encontró un enlace de descarga válido.`);
      }
    }
  } catch (error) {
    return m.reply(`⚠︎ *Error:* ${error.message}`);
  }
};

handler.command = handler.help = ['play', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')';
  } else {
    return views.toString();
  }
}
