const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command}) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
    var sum = member.length;
  } else {
    var sum = 0;
    const total = 0;
    var member = 0;
  }
  
  const pesan = args.join` `;
  const oi = `${pesan}`;
  
  
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  
  
  const nozomiMessages = [
    "¡Atención estudiantes de Millennium!",
    "Reunión de emergencia del consejo estudiantil",
    "¡Todos a formar! Necesito su atención",
    "Convocatoria general de la academia",
    "¡Sensei requiere la presencia de todos!",
    "Asamblea estudiantil en progreso"
  ];
  
  const randomMessage = nozomiMessages[Math.floor(Math.random() * nozomiMessages.length)];
  
  let teks = `
╭─────────────────────╮
│💙 𝗧𝗔𝗖𝗛𝗜𝗕𝗔𝗡𝗔 𝗡𝗢𝗭𝗢𝗠𝗜 💙│
╰─────────────────────╯

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌸 ${randomMessage}  
┃  📚 Grupo: ${groupName}
┃  👥 Miembros convocados: ${participants.length}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

${oi ? `💬 **Mensaje:** ${oi}\n` : ''}
╔═════════════════════╗
║📋 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗔𝗦𝗜𝗦𝗧𝗘𝗡𝗖𝗜𝗔║
╚═════════════════════╝
`;

  
  const memberEmojis = ['🌸', '💙', '⭐', '💫', '🎯', '📚', '🌟', '💎', '🎪', '🔷'];
  
  for (let i = 0; i < participants.length; i++) {
    const mem = participants[i];
    const emoji = memberEmojis[i % memberEmojis.length];
    teks += `┃ ${emoji} @${mem.id.split('@')[0]}\n`;
  }
  
  teks += `╚══════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎓 Millennium Science School ┃
┃  📊 Sistema de Información Estudiantil
┃  🌸 Tachibana Nozomi - Asistente┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ✨ *¡Todos los estudiantes han sido notificados!*
> 🎯 *Reportar presencia es obligatorio*

────────────────────────────
💙 *Blue Archive* | 🏫 *Millennium Academy*`;

  
  await conn.sendMessage(m.chat, {
    text: teks, 
    mentions: participants.map((a) => a.id)
  });
  
 
  await m.react('🌸');
};

handler.help = ['tagall <mensaje>', 'invocar <mensaje>', 'convocar <mensaje>'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación|ta|convocar|reunion|asamblea)$/i;
handler.admin = true;
handler.group = true;
export default handler;
