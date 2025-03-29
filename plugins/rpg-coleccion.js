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
        console.error('❌ Error al cargar database:', error);
        return { users: {} };
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    
    try {
        
        const db = loadDatabase();
        
        
        if (!db.users[userId] || !db.users[userId].characters || db.users[userId].characters.length === 0) {
            return m.reply('📝 Tu colección está vacía. Usa .rw para obtener personajes.');
        }
        
        const collection = db.users[userId].characters;
        
        
        const rarityCount = {
            'Legendaria': 0,
            'ultra rara': 0,
            'épica': 0,
            'rara': 0,
            'común': 0
        };
        
        collection.forEach(waifu => rarityCount[waifu.rarity.toLowerCase()]++);
        
        let message = `╭━━━━『💙*VOCALOID COLLECTION*💙』━━━━╮\n\n`;
        
       
        message += `❯💙*RESUMEN DE COLECCIÓN*💙❮\n`;
        message += `\n┌──『 Rareza 』───『 Cantidad 』──┐\n`;
        message += `│ 🔴 Legendaria  │ ${rarityCount['Legendaria'].toString().padEnd(3)} │ ${createBar(rarityCount['Legendaria'], 10)} │\n`;
        message += `│ 🟡 Ultra Rara  │ ${rarityCount['ultra rara'].toString().padEnd(3)} │ ${createBar(rarityCount['ultra rara'], 10)} │\n`;
        message += `│ 🟣 Épica       │ ${rarityCount['épica'].toString().padEnd(3)} │ ${createBar(rarityCount['épica'], 10)} │\n`;
        message += `│ 🔵 Rara        │ ${rarityCount['rara'].toString().padEnd(3)} │ ${createBar(rarityCount['rara'], 10)} │\n`;
        message += `│ ⚪ Común       │ ${rarityCount['común'].toString().padEnd(3)} │ ${createBar(rarityCount['común'], 10)} │\n`;
        message += `└────────────────────────────┘\n\n`;
        
        
        message += `📊 Total: ${collection.length} personajes\n\n`;
        
   
        const rarityEmojis = {
            'legendaria': '🔴',
            'ultra rara': '🟡',
            'épica': '🟣',
            'rara': '🔵',
            'común': '⚪'
        };
        
      
        const groupedByRarity = {};
        collection.forEach(waifu => {
            const rarityLower = waifu.rarity.toLowerCase();
            if (!groupedByRarity[rarityLower]) {
                groupedByRarity[rarityLower] = [];
            }
            groupedByRarity[rarityLower].push(waifu);
        });
        
      
        for (const rarity of Object.keys(rarityCount)) {
            const rarityLower = rarity.toLowerCase();
            if (groupedByRarity[rarityLower]?.length > 0) {
                message += `╭─『 ${rarityEmojis[rarityLower]} ${rarity.toUpperCase()} 』\n`;
                groupedByRarity[rarityLower].forEach((waifu, index) => {
                    message += `│ ${(index + 1).toString().padStart(2)}. ${waifu.name}\n`;
                });
                message += `╰────────────\n`;
            }
        }
        
        message += `\n╰━━━━『 FIN DE COLECCIÓN 』━━━━╯`;
        
        return conn.reply(m.chat, message, m);
    } catch (e) {
        console.error(e);
        return m.reply('💙 Error al mostrar la colección. Intenta de nuevo.');
    }
}


function createBar(value, maxSize) {
    const filled = Math.ceil((value / 20) * maxSize); 
    const empty = maxSize - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

handler.help = ['collection', 'coleccion']
handler.tags = ['rpg']
handler.command = /^(collection|coleccion|col|personajes|inventario)$/i
handler.group = true

export default handler;
