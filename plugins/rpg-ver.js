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
        console.error('❌ Error loading database:', error);
        return { users: {} };
    }
}


function getCharacterImage(characterName) {
    
    const characterImages = {
        
        "Hatsune Chibi": "./storage/chibis/miku_chibi.png",
        "Neru Chibi": "./storage/chibis/neru_chibi.png",
        "Rin Chibi": "./storage/chibis/rin_chibi.png",
        "Teto Chibi": "./storage/chibis/teto_chibi.png",
        "Emu Chibi": "./storage/chibis/emu_chibi.png",
        "Len Chibi": "./storage/chibis/len_chibi.png",
        "Luka Chibi": "./storage/chibis/luka_chibi.png",
        
       
        "Hatsune Miku 2006": "./storage/raros/miku_raro.png",
        "Akita Neru 2006": "./storage/raros/neru_raro.png",
        "Rin": "./storage/raros/rin_raro.png",
        "Teto": "./storage/raros/teto_raro.png",
        "Emu Otori": "./storage/raros/emu_raro.png",
        "Len": "./storage/raros/len_raro.png",
        "Luka Megurine 2006": "./storage/raros/luka_raro.png",
        
        
        "💙Miku💙": "./storage/epicos/miku_epico.png",
        "💛Neru💛": "./storage/epicos/neru_epico.png",
        "💛Rin💛": "./storage/epicos/rin_epico.png",
        "❤Teto❤": "./storage/epicos/tetos_epico.png",
        "💗Emu💗": "./storage/epicos/emu_epico.png",
        "Len (gei)": "./storage/epicos/len_epico.png",
        "💗LUKA🪷": "./storage/epicos/luka_epico.png",
        
        
        "💙HATSUNE MIKU💙": "./storage/ultra/miku_ultra.png",
        "💛AKITA NERU💛": "./storage/ultra/neru_ultra.png",
        "💗EMU OTORI💗": "./storage/ultra/emu_ultra.png",
        "❤KASANE TETO❤": "./storage/ultra/teto_ultra.png",
        "💛KAGAMINE RIN💛": "./storage/ultra/rin_ultra.png",
        "💥KAGAMINE LEN💢": "./storage/ultra/len_ultra.png",
        "💗MEGUMIRE LUKA💮": "./storage/ultra/luka_ultra.png",
        
       
        "💙Brazilian Miku💛": "./legend/miku_legend.jpg",
        "🖤Inabakumori🖤": "./storage/legend/ibana_legend.jpg",
        "❤KASANE TETO❤": "./storage/legend/teto_legend.png",
        "☢️Cyberpunk Edgeruners💫": "./storage/legend/cyber_legend.png",
        "❤️🩷VOCALOIDS💛💙": "./storage/legend/voca_legend.jpg",
        "🏴‍☠️🌌HALO⚕️☢️": "./storage/legend/halo_legend.png"
    };
    
    
    return characterImages[characterName] || "./storage/chibis/miku_chibi.png";
}

let handler = async (m, { conn, args }) => {
    const userId = m.sender;
    
    try {
        
        const db = loadDatabase();
        
        
        if (!db.users[userId] || !db.users[userId].characters || db.users[userId].characters.length === 0) {
            return m.reply('📝 Tu colección está vacía. Usa .rw para obtener personajes.');
        }
        
        const collection = db.users[userId].characters;
        
        
        if (args.length === 0) {
            return m.reply(`💙 Uso: .ver <número>\n\nEjemplo: .ver 1\n\nUsa .col para ver tu colección y el orden de cada personaje.`);
        }
        
        const characterIndex = parseInt(args[0]) - 1;
        
        
        if (isNaN(characterIndex) || characterIndex < 0 || characterIndex >= collection.length) {
            return m.reply(`❌ Número de personaje inválido. Debes usar un número entre 1 y ${collection.length}.`);
        }
        
        const character = collection[characterIndex];
        const imagePath = getCharacterImage(character.name);
        
        
        const rarityEmojis = {
            'legendaria': '🔴',
            'ultra rara': '🟡',
            'épica': '🟣',
            'rara': '🔵',
            'común': '⚪'
        };
        
        const rarityLower = character.rarity.toLowerCase();
        const rarityEmoji = rarityEmojis[rarityLower] || '⚪';
        
        
        await conn.sendFile(
            m.chat, 
            imagePath, 
            'character.jpg', 
            `💎 *${character.name}* 💎\n` +
            `${rarityEmoji} Rareza: ${character.rarity.toUpperCase()}\n` +
            `📅 Obtenido: ${new Date(character.obtainedAt).toLocaleDateString()}\n`,
            m
        );
    } catch (e) {
        console.error(e);
        return m.reply('💙 Error al mostrar el personaje. Intenta de nuevo.');
    }
}

handler.help = ['view', 'ver']
handler.tags = ['rpg']
handler.command = /^(view|ver|v)$/i
handler.group = true

export default handler;
