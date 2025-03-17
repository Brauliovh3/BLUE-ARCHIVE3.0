let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup) return true; // Solo para grupos

  let chat = global.db.data.chats[m.chat]; // Asegúrate de que `global.db.data.chats` esté configurado correctamente
  if (!chat) {
    global.db.data.chats[m.chat] = { onlyLatinos: false }; // Inicializar chat si no existe
    chat = global.db.data.chats[m.chat];
  }

  if (isBotAdmin && chat.onlyperu && !isAdmin && !isOwner) {
    let forbidPrefixes = ["51"]; // Solo expulsar usuarios peruanos

    for (let prefix of forbidPrefixes) {
      if (m.sender.startsWith(prefix)) {
        await conn.reply(m.chat, '💙 En este grupo no se permite el acceso a usuarios peruanos (+51).');
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        return false;
      }
    }
  }

  return true;
};

// Comando para activar o desactivar el modo onlyLatinos
handler.command = /^onlylatinos$/i; // Usa este comando para configurarlo en el chat
handler.admin = true; // Solo admins pueden activarlo
handler.group = true; // Solo funciona en grupos

handler.handler = async function (m, { conn, args, isAdmin }) {
  if (!isAdmin) return conn.reply(m.chat, 'Solo los administradores pueden usar este comando.', m);
  
  let chat = global.db.data.chats[m.chat];
  if (!chat) {
    global.db.data.chats[m.chat] = { onlyLatinos: false }; // Inicializar chat si no existe
    chat = global.db.data.chats[m.chat];
  }

  chat.onlyLatinos = !chat.onlyLatinos; // Alternar el estado
  conn.reply(m.chat, `💙 El modo "onlyLatinos" está ahora ${chat.onlyLatinos ? 'activado' : 'desactivado'}.`);
};

export default handler;
