let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.fromMe 
              ? conn.user.jid 
              : m.sender;

  let avatarUrl = await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');

  let apiUrl = `https://some-random-api.com/canvas/overlay/gay?avatar=${encodeURIComponent(avatarUrl)}`;

  try {
    await conn.sendFile(m.chat, apiUrl, 'gay.png', '*¿Quién quiere violar a este gay?* 🏳️‍🌈', m);
  } catch (err) {
    console.error(err);
    m.reply('⚠️ Hubo un error al procesar tu solicitud.');
  }
};

handler.help = ['gei,gey,gay *@user*'];
handler.tags = ['fun'];
handler.command = /^(gay)$/i;

export default handler;
