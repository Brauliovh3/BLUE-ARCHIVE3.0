import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, text, args }) => {
  if (!text) {
    return m.reply("💙 Ingresa un texto de lo que quieres buscar");
  }

  let ytres = await search(args.join(" "));
  if (ytres.length === 0) {
    return m.reply("❀ No se encontraron resultados");
  }

  let txt = ` 💙🅗🅐🅣🅢🅤🅝🅔 🅜🅘🅚🅤💙
💙★웃웃유유유♫♫Ɖ♪♪유유유웃웃★💙
💙Título: ${ytres[0].title}
💙Duración: ${ytres[0].timestamp}
💙Publicado: ${ytres[0].ago}
💙Canal: ${ytres[0].author.name || 'Desconocido'}
💙Url: https://youtu.be/${ytres[0].videoId}
💙★웃웃유유유♫♫Ɖ♪♪유유유웃웃★💙

💙 𝙀𝙨𝙥𝙚𝙧𝙚 𝙪𝙣 𝙢𝙤𝙢𝙚𝙣𝙩𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙨𝙪 𝙫𝙞́𝙙𝙚𝙤 💙`;

  await conn.sendFile(m.chat, ytres[0].image, 'thumbnail.jpg', txt, m);

  try {
    let apiResponse = await fetch(`https://api.vreden.web.id/api/ytplaymp4?query=${ytres[0].url}&apikey=0a2cc90e`);
    let json = await apiResponse.json();

    if (json.result && json.result.download && json.result.download.url) {
      let { title, url: mp4 } = json.result.download;

      await conn.sendMessage(m.chat, { video: { url: mp4 }, caption: `*💙 Hatsune Miku:*  ${text}`, mimetype: 'video/mp4', fileName: `Sumi Sakurazawa - ${title}.mp4` }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } else {
      throw new Error('La API no devolvió los datos esperados.');
    }
  } catch (error) {
    console.error(error);
    m.reply("💙 Ocurrió un error al intentar descargar el video");
  }
};

handler.command = /^(play2)$/i;

export default handler;

async function search(query, options = {}) {
  let searchResults = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return searchResults.videos;
}
