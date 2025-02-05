import { promises as fs } from 'fs';

// Base de datos global
global.db = global.db || {};
global.db.waifu = global.db.waifu || {
    cooldowns: {},
    waifus: {},
    collection: {}
};

// Lista de waifus organizadas por rareza
const waifuList = [
    // Waifus Comunes (35% probabilidad total)
    {
        name: "Hatsune Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/miku_chibi.png"
    },
    {
        name: "Neru Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/neru_chibi.png"
    },
    {
        name: "Rin Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/rin_chibi.png"
    },
    {
        name: "Teto Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/teto_chibi.png"
    },
    {
        name: "Emu Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/emu_chibi.png"
    },
    {
        name: "Len Chibi",
        rarity: "común",
        probability: 7,
        img: "./chibis/len_chibi.png"
    },

    // Waifus Raras (30% probabilidad total)
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 6,
        img: "./raros/miku_raro.png"
    },
    {
        name: "Akita Neru 2006",
        rarity: "rara",
        probability: 6,
        img: "./raros/neru_raro.png"
    },
    {
        name: "Rin",
        rarity: "rara",
        probability: 6,
        img: "./raros/rin_raro.png"
    },
    {
        name: "Teto",
        rarity: "rara",
        probability: 6,
        img: "./raros/teto_raro.png"
    },
    {
        name: "Emu Otori",
        rarity: "rara",
        probability: 6,
        img: "./raros/emu_raro.png"
    },
    {
        name: "Len",
        rarity: "rara",
        probability: 6,
        img: "./raros/len_raro.png"
    },

    // Waifus Épicas (25% probabilidad total)
    {
        name: "💙Miku💙",
        rarity: "épica",
        probability: 5,
        img: "./epicos/miku_epico.png"
    },
    {
        name: "💛Neru💛",
        rarity: "épica",
        probability: 5,
        img: "./epicos/neru_epico.png"
    },
    {
        name: "💛Rin💛",
        rarity: "épica",
        probability: 5,
        img: "./epicos/rin_epico.png"
    },
    {
        name: "❤Teto❤",
        rarity: "épica",
        probability: 5,
        img: "./epicos/tetos_epico.png"
    },
    {
        name: "💗Emu💗",
        rarity: "épica",
        probability: 5,
        img: "./epicos/emu_epico.png"
    },
    {
        name: "Len (gei)",
        rarity: "épica",
        probability: 5,
        img: "./epicos/len_epico.png"
    },

    // Waifus Ultra Raras (10% probabilidad total)
    {
        name: "💙HATSUNE MIKU💙",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/miku_ultra.png"
    },
     {
        name: "💛AKITA NERU💛",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/neru_ultra.png"
    },
    {
        name: "💗EMU OTORI💗",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/emu_ultra.png"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/teto_ultra.png"
    },
    {
        name: "💛KAGAMINE RIN💛",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/rin_ultra.png"
    },
    {
        name: "💥KAGAMINE LEN💢",
        rarity: "ultra rara",
        probability: 2,
        img: "./ultra/len_ultra.png"
    },

    //Legendarias (01% de Probabilidad)

    {
        name: "💙Brazilian Miku💛",
        rarity: "Legendaria",
        probability: 1,
        img: "./legend/miku_legend.jpg"
    },
    {
        name: "🖤Inabakumori🖤",
        rarity: "Legendaria",
        probability: 1,
        img: "./legend/ibana_legend.jpg"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "Legendaria",
        probability: 1,
        img: "./legend/teto_legend.png"
    },
    {
        name: "☢️Cyberpunk Edgeruners💫",
        rarity: "Legendaria",
        probability: 1,
        img: "./legend/cyber_legend.png"
    },
    {
        name: "❤️🩷VOCALOIDS💛💙",
        rarity: "Legendaria",
        probability: 1,
        img: "./legend/voca_legend.jpg"
    }
];

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
    // Verificar cooldown (30 minutos = 1800000 ms)
    if (global.db.waifu.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.waifu.cooldowns[userId];
        if (timeDiff < 1800000) { // 30 minutos
            const remainingTime = 1800000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ Debes esperar ${minutes}m ${seconds}s para volver a usar este comando.`);
        }
    }

    // Generar roll y seleccionar waifu
    const roll = Math.random() * 100;
    let accumulatedProb = 0;
    let selectedWaifu = null;
    for (const waifu of waifuList) {
        accumulatedProb += waifu.probability;
        if (roll <= accumulatedProb) {
            selectedWaifu = waifu;
            break;
        }
    }

    // Colores según rareza
    const rarityColors = {
        'común': '⚪',
        'rara': '🔵',
        'épica': '🟣',
        'ultra rara': '🟡',
        'Legendaria': '🔴'
    };

    // Crear mensaje
    let message = `🎲 WAIFU GACHA 🎲\n\n`;
    message += `👤 Invocador: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedWaifu.rarity]} Rareza: ${selectedWaifu.rarity.toUpperCase()}\n`;
    message += `💙 Waifu: ${selectedWaifu.name}\n`;
    message += `\n💫 Usa .save para guardar tu waifu!`;

    // Enviar mensaje con imagen
    try {
        await conn.sendMessage(m.chat, { 
            image: { url: selectedWaifu.img },
            caption: message,
            mentions: [userId]
        });
    } catch (e) {
        console.log(e);
        return m.reply('Error al enviar la imagen. Intenta de nuevo.');
    }

    // Actualizar base de datos
    global.db.waifu.cooldowns[userId] = currentTime;
    global.db.waifu.waifus[userId] = selectedWaifu;
}

handler.help = ['rw']
handler.tags = ['rpg']
handler.command = /^(rw|rollwaifu)$/i
handler.group = true
handler.cooldown = 1800000 // 30 minutos

export default handler
