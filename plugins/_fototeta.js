let handler = async (m, { conn, usedPrefix, command }) => {
 
  const prayerMessage = `
╭────────────────────────────╮
│🌸 𝗠𝗢𝗠𝗘𝗡𝗧𝗢 𝗗𝗘 𝗥𝗘𝗙𝗟𝗘𝗫𝗜𝗢́𝗡 🌸│
╰────────────────────────────╯

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃🙏 Oración de la Academia┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

✨ *Padre nuestro, que estás en los Cielos,*
✨ *santificado sea tu nombre,*
✨ *venga tu Reino,*
✨ *hágase tu voluntad*
✨ *así en la tierra como en el cielo.*

🌸 *Danos hoy nuestro pan de cada día,*
🌸 *y perdónanos nuestras deudas*
🌸 *así como nosotros perdonamos*
🌸 *a nuestros deudores,*

💫 *y no nos dejes caer en la tentación,*
💫 *mas líbranos del mal.*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃🎓 Millennium Science School ┃
┃🌸 Momento de paz y reflexión ┃
┃✨ Tachibana Nozomi          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> 🙏 *"En los momentos de dificultad, la fe nos guía"*
> 💙 *- Palabras de sabiduría estudiantil*

─────────────────────────────────
🌟 *¡Que tengas un día bendecido, Sensei!*`;

  
  await conn.reply(m.chat, prayerMessage, m, {
    contextInfo: { 
      externalAdReply: { 
        mediaUrl: null, 
        mediaType: 1, 
        showAdAttribution: true,
        title: '🌸 Momento de Reflexión Espiritual',
        body: '🙏 Tachibana Nozomi | Millennium Academy',
        previewType: 0, 
        thumbnail: Buffer.alloc(0),
        sourceUrl: 'https://github.com/Brauliovh3'
      }
    }
  });
  
  
  await m.react('🙏');
};


handler.help = ['orar', 'prayer', 'reflexion'];
handler.tags = ['general'];
handler.command = /^(fototeta|fototta)$/i;
handler.register = true;

export default handler;
