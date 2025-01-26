import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '💙 Ingresa el nombre de la canción que quieras buscar.',
      m
    );
  }

  try {
    // Llamada a la API
    const api = await fetch(`https://api.vreden.web.id/api/ytplaymp3?query=${encodeURIComponent(text)}`);
    if (!api.ok) throw new Error(`Error HTTP! estado: ${api.status}`);
    
    const json = await api.json();
    console.log(json); // Para depuración

    if (!json.result || !json.result.metadata) {
      throw new Error('La API no devolvió datos válidos.');
    }

    // Extraer datos
    const { title, thumbnail, timestamp, ago, views, author } = json.result.metadata;
    let downloadUrl = json.result.download.url;

    // Verificar si la URL es relativa y convertirla a absoluta si es necesario
    if (!/^https?:\/\//i.test(downloadUrl)) {
      downloadUrl = `https://api.vreden.web.id${downloadUrl}`;
    }

    console.log('Enlace de descarga:', downloadUrl); // Para verificar el enlace

    const HS = `
💙 *Información de la canción:*
- 🎵 *Título:* ${title}
- ⏱️ *Duración:* ${timestamp}
- 📅 *Subido hace:* ${ago}
- 👀 *Visitas:* ${views}
- ✍️ *Autor:* ${author.name}
`.trim();

    // Enviar la información y la imagen
    await conn.sendFile(m.chat, thumbnail, 'song-thumbnail.jpg', HS, m);

    // Descargar el archivo manualmente y enviarlo
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`Error al descargar el archivo: ${res.statusText}`);

    const buffer = await res.buffer(); // Obtener los datos del archivo como buffer
    if (buffer.length === 0) throw new Error('El archivo descargado está vacío.');

    await conn.sendFile(
      m.chat,
      buffer,
      `${title}.mp3`,
      null,
      m,
      null,
      { mimetype: 'audio/mpeg' } // Forzar el tipo MIME como MP3
    );
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '⚠️ Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.', m);
  }
};

handler.command = /^(play)$/i;

export default handler;
