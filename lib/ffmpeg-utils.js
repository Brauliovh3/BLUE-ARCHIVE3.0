import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Obtiene la duración de un video
 * @param {Buffer} buffer - Buffer del video
 * @returns {Promise<number>} - Duración en segundos
 */
export async function getVideoDuration(buffer) {
  const tmpVideo = path.join(tmpdir(), `${Date.now()}_video.mp4`);
  await fs.promises.writeFile(tmpVideo, buffer);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(tmpVideo, (err, metadata) => {
     
      fs.unlink(tmpVideo, () => {});
      
      if (err) {
        reject(new Error('Error al obtener la duración del video'));
        return;
      }
      
      // Obtener la duración del video
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
}

/**
 * Procesa un video para convertirlo en sticker animado
 * Optimizado para videos de hasta 10 segundos
 * @param {Buffer} buffer - Buffer del video
 * @param {string} packName - Nombre del paquete de stickers
 * @param {string} author - Autor del sticker
 * @returns {Promise<Buffer>} - Buffer del sticker WebP
 */
export async function processVideo(buffer, packName, author) {
  const tmpInput = path.join(tmpdir(), `${Date.now()}_input.mp4`);
  const tmpOutput = path.join(tmpdir(), `${Date.now()}_output.webp`);

  try {
    await fs.promises.writeFile(tmpInput, buffer);

    return new Promise((resolve, reject) => {
      ffmpeg(tmpInput)
        .outputOptions([
          // Optimizaciones para videos largos (hasta 10s)
          '-vf', 'fps=12,scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000',
          '-c:v', 'libwebp',
          '-loop', '0',
          '-preset', 'default',
          '-compression_level', '6', 
          '-quality', '60', 
          '-lossless', '0', 
          '-an', 
          '-vsync', '0',
          // Si prefieres limitar la duración a 3s (recomendado para WhatsApp), descomenta:
          // '-t', '3',
        ])
        .toFormat('webp')
        .on('error', (err) => {
          console.error('Error al procesar video:', err);
          reject(new Error('Error al procesar el video: ' + err.message));
        })
        .on('end', async () => {
          try {
            const data = await fs.promises.readFile(tmpOutput);
            resolve(data);
          } catch (readErr) {
            reject(new Error('Error al leer el sticker generado'));
          } finally {
            
            if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
            if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
          }
        })
        .save(tmpOutput);
    });
  } catch (e) {
    console.error(e);
   
    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
    throw e;
  }
}

/**
 * Procesa una imagen para convertirla en sticker
 * @param {Buffer} buffer - Buffer de la imagen
 * @param {string} packName - Nombre del paquete de stickers
 * @param {string} author - Autor del sticker
 * @returns {Promise<Buffer>} - Buffer del sticker WebP
 */
export async function processImage(buffer, packName, author) {
  const tmpInput = path.join(tmpdir(), `${Date.now()}_input.png`);
  const tmpOutput = path.join(tmpdir(), `${Date.now()}_output.webp`);

  try {
    await fs.promises.writeFile(tmpInput, buffer);

    return new Promise((resolve, reject) => {
      ffmpeg(tmpInput)
        .outputOptions([
          '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000',
          '-c:v', 'libwebp',
          '-compression_level', '6',
          '-quality', '80', 
          '-lossless', '0',
          '-vsync', '0'
        ])
        .toFormat('webp')
        .on('error', (err) => {
          console.error('Error al procesar imagen:', err);
          reject(new Error('Error al procesar la imagen: ' + err.message));
        })
        .on('end', async () => {
          try {
            const data = await fs.promises.readFile(tmpOutput);
            resolve(data);
          } catch (readErr) {
            reject(new Error('Error al leer el sticker generado'));
          } finally {
            
            if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
            if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
          }
        })
        .save(tmpOutput);
    });
  } catch (e) {
    console.error(e);
    
    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
    if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
    throw e;
  }
}

/**
 * Verifica si una cadena es una URL válida de imagen o video
 * @param {string} text - Texto a verificar
 * @returns {boolean} - true si es una URL válida
 */
export function isUrl(text) {
  return /https?:\/\/.*\.(jpe?g|png|webp|mp4|gif)/i.test(text);
}
