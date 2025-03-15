import { exec } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { tmpdir } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

/**
 * Convertir imagen/video a sticker
 * @param {Buffer} img Buffer de la imagen
 * @param {string} url URL de la imagen
 * @param {string} packname Nombre del paquete del sticker
 * @param {string} author Autor del sticker
 * @param {string} [quality] Calidad del sticker (default: 50)
 * @param {object} metadata Metadatos
 * @returns {Promise<Buffer>}
 */
async function sticker(img, url, packname, author, quality = 50, metadata = {}) {
  try {
    if (url) {
      img = await fetch(url).then(res => res.buffer());
    }
    
    
    const type = await fileTypeFromBuffer(img) || {
      mime: 'application/octet-stream',
      ext: 'bin'
    };
    
    if (type.mime === 'image/webp') {
      
      return await addExif(img, packname, author, metadata);
    }
    
    const tmpFileIn = path.join(tmpdir(), `${Date.now()}.${type.ext}`);
    const tmpFileOut = path.join(tmpdir(), `${Date.now()}.webp`);
    
    await fs.promises.writeFile(tmpFileIn, img);
    
    
    return new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i ${tmpFileIn} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000,setsar=1" -f webp -quality ${quality} ${tmpFileOut}`, async (error) => {
        try {
          fs.unlinkSync(tmpFileIn);
          if (error) {
            fs.unlinkSync(tmpFileOut);
            reject(error);
            return;
          }
          
          const buff = await fs.promises.readFile(tmpFileOut);
          fs.unlinkSync(tmpFileOut);
          
          const webpWithMetadata = await addExif(buff, packname, author, metadata);
          resolve(webpWithMetadata);
        } catch (e) {
          reject(e);
        }
      });
    });
  } catch (error) {
    throw error;
  }
}


async function addExif(webpBuffer, packname, author, metadata = {}) {
  try {
    
    try {
      const { default: webpmux } = await import('node-webpmux');
      const img = new webpmux.Image();
      await img.load(webpBuffer);
      
      const exifData = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00
      ]);
      
      const json = {
        'sticker-pack-id': 'com.bot.whatsapp',
        'sticker-pack-name': packname,
        'sticker-pack-publisher': author,
        'emojis': metadata.emojis || ['🤖'],
        ...metadata
      };
      
      const exifAttr = Buffer.from(JSON.stringify(json), 'utf8');
      const exif = Buffer.concat([exifData, exifAttr]);
      exif.writeUIntLE(exifAttr.length, 14, 4);
      
      await img.setExif(exif);
      return await img.save(null);
    } catch (e) {
      
      console.error('Error al agregar metadatos:', e);
      return webpBuffer;
    }
  } catch (error) {
    return webpBuffer;
  }
}

export { sticker };
