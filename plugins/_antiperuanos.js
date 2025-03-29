let handler = m => m;
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner }) {
  if (!m.isGroup) return true; 
  
 
  console.log('Processing message in group:', m.chat);
  
  let chat = global.db.data.chats[m.chat];
  
  
  if (!chat) {
    console.log('Chat data not found, initializing');
    global.db.data.chats[m.chat] = { 
      antiPeruanos: false,
      onlyLatinos: false,
     
    };
    chat = global.db.data.chats[m.chat];
  }
  
  console.log('antiPeruanos status:', chat.antiPeruanos);
  
  
  if (isBotAdmin && chat.antiPeruanos && !isAdmin && !isOwner) {
    console.log('Checking if user is from Peru');
    let forbidPrefixes = ["51"]; 
    
    
    const sender = m.sender.split('@')[0];
    console.log('Sender number:', sender);
    
    for (let prefix of forbidPrefixes) {
      if (sender.startsWith(prefix)) {
        console.log('Peruvian user detected, removing');
        await conn.reply(m.chat, '💙 En este grupo no se permite el acceso a usuarios peruanos (+51).', m);
        
        try {
          await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
          console.log('User removed successfully');
        } catch (error) {
          console.error('Error removing user:', error);
          await conn.reply(m.chat, '💙 No se pudo eliminar al usuario. Error: ' + error.message, m);
        }
        
        return false;
      }
    }
  }
  
  return true;
};

export default handler;
