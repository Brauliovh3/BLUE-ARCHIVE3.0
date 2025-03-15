/**
 * Crea un sticker animado a partir de un GIF o video
 * @param {Buffer} mediaData - Buffer del GIF o video
 * @param {Object} options - Opciones de configuración
 * @returns {Promise<Buffer>} - Buffer del sticker WebP animado
 */
async function createAnimatedSticker(mediaData, options = {}) {
  const tmpDir = path.join(tmpdir(), `sticker_${Date.now()}`);
  const input = path.join(tmpDir, 'input.gif');
  const output = path.join(tmpDir, 'output.webp');
  
 
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  
  try {
    
    await fs.promises.writeFile(input, mediaData);
    
   
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', input,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=00000000',
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', options.quality?.toString() || '80',
        '-loop', '0',
        '-preset', 'default',
        '-an',
        '-vsync', '0',
        '-t', '10', 
        '-f', 'webp',
        output
      ]);
      
      ffmpeg.on('error', reject);
      ffmpeg.on('close', async (code) => {
        if (code !== 0) {
          return reject(new Error(`FFmpeg cerrado con código ${code}`));
        }
        
        const buffer = await fs.promises.readFile(output);
        try {
         
          const { default: webpmux } = await import('node-webpmux');
          const img = new webpmux.Image();
          await img.load(buffer);
          
          const exifData = Buffer.from([
            0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
            0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x16, 0x00, 0x00, 0x00
          ]);
          
          const jsonData = {
            'sticker-pack-id': 'com.bot.whatsapp',
            'sticker-pack-name': options.pack || 'Bot WhatsApp',
            'sticker-pack-publisher': options.author || 'Bot',
            'emojis': options.emojis || ['🤖']
          };
          
          const exifAttr = Buffer.from(JSON.stringify(jsonData), 'utf8');
          const exif = Buffer.concat([exifData, exifAttr]);
          exif.writeUIntLE(exifAttr.length, 14, 4);
          
          await img.setExif(exif);
          const finalBuffer = await img.save(null);
          resolve(finalBuffer);
        } catch (e) {
          console.error('Error al añadir metadatos:', e);
          
          resolve(buffer);
        }
      });
    });
  } catch (error) {
    throw error;
  } finally {
    
    try {
      if (fs.existsSync(input)) fs.unlinkSync(input);
      if (fs.existsSync(output)) fs.unlinkSync(output);
      if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir, { recursive: true });
    } catch (e) {
      console.error('Error al limpiar archivos temporales:', e);
    }
  }
}
