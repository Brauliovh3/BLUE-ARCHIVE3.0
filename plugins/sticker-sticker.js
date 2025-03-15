import fetch from 'node-fetch';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    
    const noMediaMessage = `💙 Responde a una imagen o video (máx. 10s) con *${usedPrefix + command}*\n\n`;

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Procesar si es una imagen
    if (/image/.test(mime)) {
      m.reply('*💙 Procesando imagen...*');
      let img = await q.download();
      if (!img) throw '*💙 No se pudo descargar la imagen*';

      let stiker = await processImage(img, 'Hatsune Miku', '@StarlightsTeam');
      if (stiker) {
        await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
      } else {
        throw '*💙 Error al crear el sticker*';
      }
    }
    // Procesar si es un video
    else if (/video/.test(mime)) {
      m.reply('*💙 Procesando video...*');
      let video = await q.download();
      if (!video) throw '*💙 No se pudo descargar el video*';

      const duration = await getVideoDuration(video);
      if (duration > 10) throw '*💙 El video no puede durar más de 10 segundos*';

      let stiker = await processVideo(video, 'Hatsune Miku', '@StarlightsTeam');
      if (stiker) {
        await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
      } else {
        throw '*💙 Error al crear el sticker animado*';
      }
    }
    // Procesar si es una URL
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

          let stiker = await processVideo(media, 'Hatsune Miku', '@StarlightsTeam');
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

// Función para obtener la duración de un video
async function getVideoDuration(buffer) {
  const tmpVideo = path.join(tmpdir(), `${Date.now()}_video.mp4`);
  await fs.promises.writeFile(tmpVideo, buffer);

  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', tmpVideo]);

    let duration = 0;
    ffprobe.stdout.on('data', (data) => {
      duration = parseFloat(data.toString());
    });

    ffprobe.on('close', (code) => {
      fs.unlink(tmpVideo, () => {});
      if (code !== 0) reject(new Error('Error al obtener la duración del video'));
      resolve(duration);
    });

    ffprobe.on('error', (e) => {
      fs.unlink(tmpVideo, () => {});
      reject(e);
    });
  });
}


async function processVideo(buffer, packName, author) {
  const tmpInput = path.join(tmpdir(), `${Date.now()}_input.mp4`);
  const tmpOutput = path.join(tmpdir(), `${Date.now()}_output.webp`);

  try {
    await fs.promises.writeFile(tmpInput, buffer);

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
    '-i', tmpInput,
    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000',
    '-c:v', 'libwebp',
    '-loop', '0',
    '-preset', 'default',
    '-an',
    '-vsync', '0',
    tmpOutput
]);

      ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error('FFmpeg falló'))));
    });

    const data = await fs.promises.readFile(tmpOutput);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
  }
}

// Función para procesar imágenes en stickers
async function processImage(buffer, packName, author) {
  const tmpInput = path.join(tmpdir(), `${Date.now()}_input.png`);
  const tmpOutput = path.join(tmpdir(), `${Date.now()}_output.webp`);

  try {
    await fs.promises.writeFile(tmpInput, buffer);

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
    '-i', tmpInput,
    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000',
    '-c:v', 'libwebp',
    '-loop', '0',
    '-preset', 'default',
    '-an',
    '-vsync', '0',
    tmpOutput
]);

      ffmpeg.on('close', (code) => (code === 0 ? resolve() : reject(new Error('FFmpeg falló'))));
    });

    const data = await fs.promises.readFile(tmpOutput);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
  }
}

const isUrl = (text) => /https?:\/\/.*\.(jpe?g|png|webp|mp4)/i.test(text);

handler.help = ['sticker', 's'];
handler.tags = ['sticker'];
handler.command = /^(s(tic?ker)?)$/i;

export default handler;
