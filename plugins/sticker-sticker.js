iimport fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import path from 'path';
import { processVideo, processImage, getVideoDuration, isUrl } from '../lib/ffmpeg-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    
    const noMediaMessage = `💙 Responde a una imagen o video (máx. 10s) con *${usedPrefix + command}*\n\n📦 *Paquete:* Hatsune Miku\n📢 *Canal:* @StarlightsTeam`;

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    
    if (/image/.test(mime)) {
      m.reply('*💙 Procesando imagen...*');
      let img = await q.download();
      if (!img) throw '*💙 No se pudo descargar la imagen*';

      let stiker = await processImage(img, 'Hatsune Miku', 'DEPOOL');
      if (stiker) {
        await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
      } else {
        throw '*💙 Error al crear el sticker*';
      }
    }
   
    else if (/video/.test(mime)) {
      m.reply('*💙 Procesando video...*');
      let video = await q.download();
      if (!video) throw '*💙 No se pudo descargar el video*';

      const duration = await getVideoDuration(video);
      if (duration > 10) throw '*💙 El video no puede durar más de 10 segundos*';

      let stiker = await processVideo(video, 'Hatsune Miku', 'DEPOOL');
      if (stiker) {
        await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
      } else {
        throw '*💙 Error al crear el sticker animado*';
      }
    }
    
    else if (args[0] && isUrl(args[0])) {
      m.reply('*⏳ Descargando imagen/video de URL...*');
      try {
        let res = await fetch(args[0]);
        if (!res.ok) throw '*💙 Error al descargar el archivo*';
        let media = await res.buffer();

        const mimeType = res.headers.get('content-type');
        if (/image/.test(mimeType)) {
          let stiker = await processImage(media, 'Hatsune Miku', '@StarlightsTeam');
          if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
          } else {
            throw '*💙 Error al crear el sticker*';
          }
        } else if (/video/.test(mimeType)) {
          const duration = await getVideoDuration(media);
          if (duration > 10) throw '*💙 El video no puede durar más de 10 segundos*';

          let stiker = await processVideo(media, 'Hatsune Miku', 'DEPOOL');
          if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
          } else {
            throw '*💙 Error al crear el sticker animado*';
          }
        } else {
          throw '*💙 El archivo no es una imagen ni un video válido*';
        }
      } catch (e) {
        console.error(e);
        throw '*💙 Error al procesar la URL*';
      }
    } else {
      throw noMediaMessage;
    }
  } catch (e) {
    console.error(e);
    if (e.message) m.reply(e.message);
    else m.reply('*💙 Ocurrió un error al crear el sticker*');
  }
};

handler.help = ['sticker', 's'];
handler.tags = ['sticker'];
handler.command = /^(s(tic?ker)?)$/i;

export default handler;
