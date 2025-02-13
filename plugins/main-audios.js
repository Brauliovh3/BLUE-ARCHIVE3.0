import fs from 'fs';

const audioMap = {
  'miku': './media/miku.mp3',
  'mine': './media/miku2.mp3',
  'baneado': './media/baneado.mp3',
  'ayuda': './media/ayuda.mp3',
  'gey': './media/marica.mp3',
  'ara': './media/Ara.mp3',
  'bot': './media/bot.mp3',
  'bañate': './media/banate.mp3',
  'buenos dias': './media/Buenos-dias-2.mp3',
  'feliz cumpleaños': './media/Feliz-cumple.mp3',
  'invocar': './media/Invocar.mp3',
  'hentai': './media/hentai.mp3',
  'nose': './media/maau1.mp3',
  'canal': './media/canal.mp3',
  'ya': './media/ya.mp3',
  'sad': './media/sad.mp3',
  'risa': './media/jaja.mp3',
  'motivar': './media/motivar.mp3',
  'se unio': './media/se unió usando el enlace de invitación del este grupo.mp3',
  'calculadora': './media/calculadora.mp3',
  'tengo novia': './media/tengo novia.mp3'
};

let handler = async (m, { conn }) => {
  try {
    // Obtener el texto exacto del mensaje y convertirlo a minúsculas
    let text = m.text.toLowerCase().trim();
    
    // Verificar si el mensaje exacto coincide con alguna clave del audioMap
    if (audioMap[text]) {
      const audioPath = audioMap[text];
      
      // Verificar si el archivo existe
      if (!fs.existsSync(audioPath)) {
        throw new Error(`Audio no encontrado: ${audioPath}`);
      }

      // Enviar el archivo de audio
      await conn.sendFile(
        m.chat,
        audioPath,
        `${text}.mp3`,
        null,
        m,
        true,
        { type: 'audioMessage' }
      );
    }
  } catch (error) {
    console.error('Error en el manejador de audio:', error);
    m.reply('💙 Ocurrió un error al procesar el audio.');
  }
};

// Configuración del handler
handler.customPrefix = new RegExp(Object.keys(audioMap).join('|'), 'i');
handler.command = new RegExp('');  // Esto hace que coincida con cualquier mensaje

export default handler;
