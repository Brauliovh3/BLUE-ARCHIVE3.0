import Starlights from '@StarlightsTeam/Scraper';

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat,`💙 Ingrese el nombre de usuario de Instagram.\n\nEjemplo:\n> *${usedPrefix + command}* Fernanfloo`, m);

await m.react('🕓');
try {
let { username, followers, following, posts, description, url, thumbnail } = await Starlights.igstalk(text);

let txt = '`💙  I N S T A G R A M -  S T A L K  💙`\n\n';
    txt += `  💙   Usuario : ${username}\n`;
    txt += `  💙   Seguidores : ${followers}\n`;
    txt += `  💙   Siguiendo : ${following}\n`;
    txt += `  💙   Publicaciones : ${posts}\n`;
    txt += `  💙   Bio : ${description}\n`;
    txt += `  💙   Url : ${url}\n\n`;

conn.reply(m.chat, txt, m)
await m.react('✅');
} catch {
await m.react('✖️');
}
};

handler.help = ['igstalk <usuario>'];
handler.tags = ['tools'];
handler.command = ['igstalk', 'instagramstalk', 'instagram-stalk'];
handler.register = true;

export default handler;
