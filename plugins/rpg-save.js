import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'storage', 'waifudatabase');
const databaseFilePath = path.join(dbPath, 'database.json');

function loadDatabase() {
    
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }
    
    if (!fs.existsSync(databaseFilePath)) {
        return { users: {} }; 
    }
    
    try {
        const data = fs.readFileSync(databaseFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error al cargar la base de datos:', error);
        return { users: {} };
    }
}

function saveDatabase(data) {
    try {
        
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }
        
        fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('💾 Base de datos actualizada correctamente.');
        return true;
    } catch (error) {
        console.error('❌ Error al guardar la base de datos:', error);
        return false;
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const userName = (await conn.getName(userId)) || 'Desconocido'; 
    
   
    if (!global.db || !global.db.waifu || !global.db.waifu.waifus) {
        return m.reply('💙 Error del sistema. El sistema waifu no está inicializado. Intenta usar .rw primero.');
    }
    
    try {
        
        if (!m.quoted) {
            return m.reply('💙 Debes responder a un mensaje del bot con un personaje.');
        }
        
      
        console.log('🔍 Mensaje citado - fromMe:', m.quoted.fromMe);
        console.log('🔍 Mensaje citado - sender:', m.quoted.sender);
        console.log('🔍 Bot number:', conn.user?.jid || conn.user?.id);
        
        
        const isBotMessage = m.quoted.fromMe || 
                           m.quoted.sender === conn.user?.jid || 
                           m.quoted.sender === conn.user?.id ||
                           m.quoted.key?.fromMe;
        
        if (!isBotMessage) {
            return m.reply('💙 Debes responder a un mensaje del bot con un personaje.');
        }
        
        console.log('🔍 Verificando waifu para usuario:', userId);
        console.log('🔍 Waifus disponibles:', Object.keys(global.db.waifu.waifus));
        
        
        let currentWaifu = null;
        let waifuUserId = null;
        
       
        if (m.quoted.id) {
            for (const [uid, waifu] of Object.entries(global.db.waifu.waifus)) {
                if (waifu && waifu.messageId === m.quoted.id) {
                    currentWaifu = waifu;
                    waifuUserId = uid;
                    break;
                }
            }
        }
        
        
        if (!currentWaifu && global.db.waifu.waifus[userId]) {
            currentWaifu = global.db.waifu.waifus[userId];
            waifuUserId = userId;
        }
        
        if (!currentWaifu) {
            return m.reply('💙 No hay personaje disponible para guardar o ya fue reclamado.');
        }
        
        
        if (waifuUserId !== userId) {
            return m.reply('💙 No puedes reclamar este personaje. Pertenece a otro usuario.');
        }
        
        
        
        
        if (!currentWaifu.name || !currentWaifu.rarity) {
            return m.reply('💙 Error: Datos del personaje incompletos.');
        }
        
        console.log('💙 Waifu encontrada:', currentWaifu);
        
        
        let db = loadDatabase();
        
        
        if (!db.users[userId]) {
            db.users[userId] = {
                name: userName,
                characters: []
            };
        }
        
        
        const waifuExists = db.users[userId].characters.some(
            waifu => waifu.name === currentWaifu.name && waifu.rarity === currentWaifu.rarity
        );
        
        if (waifuExists) {
            delete global.db.waifu.waifus[userId];
            return m.reply('💙 Ya tienes este personaje en tu colección.');
        }
        
       
        const newCharacter = {
            name: currentWaifu.name,
            rarity: currentWaifu.rarity,
            obtainedAt: new Date().toISOString()
        };
        
        db.users[userId].characters.push(newCharacter);
        
        console.log('💾 Guardando personaje:', newCharacter);
        
        
        const saveSuccess = saveDatabase(db);
        
        if (!saveSuccess) {
            return m.reply('❌ Error al guardar en la base de datos. Intenta de nuevo.');
        }
        
        
        delete global.db.waifu.waifus[waifuUserId];
        
        
        let message = `✅ ¡VOCALOID GUARDADA! ✅\n\n`;
        message += `💙 Waifu: ${currentWaifu.name}\n`;
        message += `💎 Rareza: ${currentWaifu.rarity.toUpperCase()}\n`;
        message += `🤖 Usuario: ${userName}\n`;
        message += `🆔 ID: ${userId}\n`;
        message += `📚 Total en colección: ${db.users[userId].characters.length}\n`;
        message += `💙 Usa .col o .coleccion para ver tu colección`;
        
        return m.reply(message);
        
    } catch (e) {
        console.error('❌ Error completo en save:', e);
        return m.reply('❌ Error al guardar la waifu. Intenta de nuevo.');
    }
}

handler.help = ['save']
handler.tags = ['rpg']
handler.command = /^(save|guardar|c|claim|reclamar)$/i
handler.group = true

export default handler;
