import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'storage', 'waifudatabase');
const databaseFilePath = path.join(dbPath, 'database.json');


function loadDatabase() {
    if (!fs.existsSync(databaseFilePath)) {
        return { users: {} }; 
    }
    try {
        return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'));
    } catch (error) {
        console.error('❌ Error al cargar la base de datos:', error);
        return { users: {} };
    }
}


function saveDatabase(data) {
    try {
        fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2));
        console.log('💾 Base de datos actualizada correctamente.');
    } catch (error) {
        console.error('❌ Error al guardar la base de datos:', error);
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const userName = (await conn.getName(userId)) || 'Desconocido'; 

    if (!global.db.waifu) return m.reply('💙 Error del sistema. Intenta usar .rw primero.');

    try {
        if (!m.quoted || !m.quoted.fromMe) {
            return m.reply('💙 Debes responder a un mensaje del bot con un personaje.');
        }

        const currentWaifuOwner = Object.keys(global.db.waifu.waifus).find(key => 
            global.db.waifu.waifus[key] && 
            global.db.waifu.waifus[key].messageId === m.quoted.id
        );

        if (currentWaifuOwner && currentWaifuOwner !== userId) {
            return m.reply('💙 No puedes reclamar este personaje. Pertenece a otro usuario.');
        }

        if (!global.db.waifu.waifus[userId]) {
            return m.reply('💙 No hay personaje disponible para guardar o ya fue reclamado.');
        }

        
        let db = loadDatabase();

       
        if (!db.users[userId]) {
            db.users[userId] = {
                name: userName,
                characters: []
            };
        }

        const currentWaifu = global.db.waifu.waifus[userId];

        
        const waifuExists = db.users[userId].characters.some(
            waifu => waifu.name === currentWaifu.name && waifu.rarity === currentWaifu.rarity
        );

        if (waifuExists) {
            delete global.db.waifu.waifus[userId];
            return m.reply('💙 Ya tienes este personaje en tu colección.');
        }

       
        db.users[userId].characters.push({
            name: currentWaifu.name,
            rarity: currentWaifu.rarity,
            obtainedAt: new Date().toISOString()
        });

        
        saveDatabase(db);

       
        delete global.db.waifu.waifus[userId];

        
        let message = `✅ ¡VOCALOID GUARDADA! ✅\n\n`;
        message += `💙 Waifu: ${currentWaifu.name}\n`;
        message += `💎 Rareza: ${currentWaifu.rarity.toUpperCase()}\n`;
        message += `🤖 Usuario: ${userName}\n`;
        message += `🆔 ID: ${userId}\n`;
        message += `📚 Total en colección: ${db.users[userId].characters.length}\n`;
        message += `💙 Usa .col o .coleccion para ver tu colección`;

        return m.reply(message);

    } catch (e) {
        console.error(e);
        return m.reply('❌ Error al guardar la waifu. Intenta de nuevo.');
    }
}

handler.help = ['save']
handler.tags = ['rpg']
handler.command = /^(save|guardar|c|claim|reclamar)$/i
handler.group = true

export default handler;
