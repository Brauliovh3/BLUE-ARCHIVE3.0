let handler = async (m, { conn, usedPrefix }) => {
  // Crear el encabezado del menú
  let menu = `
╭─「 🎵 LISTA DE AUDIOS 🎵 」
│
${[
  'miku',
  'mine',
  'baneado',
  'ayuda',
  'gey',
  'ara',
  'bot',
  'bañate',
  'buenos dias',
  'feliz cumpleaños',
  'invocar',
  'hentai',
  'nose',
  'canal',
  'ya',
  'sad',
  'risa',
  'motivar',
  'calculadora',
  'tengo novia'
].map(audio => {
  return `│ 🎤 ${audio}`
}).join('\n')}
│
╰────────────────
`.trim();

  // Enviar el menú como mensaje
  m.reply(menu);
};

handler.help = ['menuaudios'];
handler.tags = ['menu'];
handler.command = /^(menuaudios|audios|menu2)$/i;

export default handler;
