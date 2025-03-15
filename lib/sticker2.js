import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convertir a sticker usando FFmpeg
 * @param {Buffer} img Buffer de imagen
 * @param {object} options Opciones para el sticker
 * @returns {Promise<Buffer>}
 */
async function createSticker(img, options = {}) {
  const pack = options.pack || 'Bot WhatsApp';
  const author = options.author || 'Bot';
  const quality = options.quality || 70;
  
  const tmpInput = path.join(tmpdir(), `${Date.now()}_input.png`);
  const tmpOutput = path.join(tmpdir(), `${Date.now()}_output.webp`);
  
  try {
    
    await fs.promises.writeFile(tmpInput, img);
    
    
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', tmpInput,
        '-vf', `scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000,setsar=1`,
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', quality.toString(),
        '-loop', '0',
        '-preset', 'default',
        '-an',
        '-vsync', '0',
        '-f', 'webp',
        tmpOutput
      ]);
      
      ffmpeg.stderr.on('data', (data) => {
        
      });
      
      ffmpeg.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`FFmpeg cerrado con código ${code}`));
          return;
        }
        resolve();
      });
    });
    
    
    const buffer = await fs.promises.readFile(tmpOutput);
    
   
    let stickerWithMetadata = buffer;
    try {
      const { default: webpmux } = await import('node-webpmux');
      const img = new webpmux
