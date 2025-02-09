import { promises as fs } from 'fs';

global.db = global.db || {};
global.db.waifu = global.db.waifu || {
    cooldowns: {},
    waifus: {},
    collection: {}
};

// Lista de waifus con probabilidades ajustadas
const waifuList = [
    // Comunes (30% probabilidad total) - reducido de 35%
    {
        name: "Hatsune Chibi",
        rarity: "común",
        probability: 5,  // reducido de 7
        img: "./chibis/miku_chibi.png"
    },
    {
        name: "Neru Chibi",
        rarity: "común",
        probability: 5,
        img: "./chibis/neru_chibi.png"
    },
    {
        name: "Rin Chibi",
        rarity: "común",
        probability: 5,
        img: "./chibis/rin_chibi.png"
    },
    {
        name: "Teto Chibi",
        rarity: "común",
        probability: 5,
        img: "./chibis/teto_chibi.png"
    },
    {
        name: "Emu Chibi",
        rarity: "común",
        probability: 5,
        img: "./chibis/emu_chibi.png"
    },
    {
        name: "Len Chibi",
        rarity: "común",
        probability: 5,
        img: "./chibis/len_chibi.png"
    },

    // Raros (28% probabilidad total) - reducido de 30%
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 4.67,  // reducido de 6
        img: "./raros/miku_raro.png"
    },
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/miku_raro.png"
    },
    {
        name: "Akita Neru 2006",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/neru_raro.png"
    },
    {
        name: "Rin",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/rin_raro.png"
    },
    {
        name: "Teto",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/teto_raro.png"
    },
    {
        name: "Emu Otori",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/emu_raro.png"
    },
    {
        name: "Len",
        rarity: "rara",
        probability: 4.67,
        img: "./raros/len_raro.png"
    },


    // Épicos (25% probabilidad total) - sin cambios
    {
        name: "💙Miku💙",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/miku_epico.png"
    },
    {
        name: "💛Neru💛",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/neru_epico.png"
    },
    {
        name: "💛Rin💛",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/rin_epico.png"
    },
    {
        name: "❤Teto❤",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/tetos_epico.png"
    },
    {
        name: "💗Emu💗",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/emu_epico.png"
    },
    {
        name: "Len (gei)",
        rarity: "épica",
        probability: 4.30,
        img: "./epicos/len_epico.png"
    },

    // Ultra Raros (12% probabilidad total) - aumentado de 10%
    {
        name: "💙HATSUNE MIKU💙",
        rarity: "ultra rara",
        probability: 2.4,  // aumentado de 2
        img: "./ultra/miku_ultra.png"
    },
    {
        name: "💛AKITA NERU💛",
        rarity: "ultra rara",
        probability: 2.4,
        img: "./ultra/neru_ultra.png"
    },
    {
        name: "💗EMU OTORI💗",
        rarity: "ultra rara",
        probability: 2.4,
        img: "./ultra/emu_ultra.png"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "ultra rara",
        probability: 2.4,
        img: "./ultra/teto_ultra.png"
    },
    {
        name: "💛KAGAMINE RIN💛",
        rarity: "ultra rara",
        probability: 2.4,
        img: "./ultra/rin_ultra.png"
    },
    {
        name: "💥KAGAMINE LEN💢",
        rarity: "ultra rara",
        probability: 2.4,
        img: "./ultra/len_ultra.png"
    },


    // Legendarios (5% probabilidad total) - aumentado de 1%
    {
        name: "💙Brazilian Miku💛",
        rarity: "Legendaria",
        probability: 1.59,  // aumentado de 1
        img: "./legend/miku_legend.jpg"
    },
    {
        name: "🖤Inabakumori🖤",
        rarity: "Legendaria",
        probability: 1.59,
        img: "./legend/ibana_legend.jpg"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "Legendaria",
        probability: 1.59,
        img: "./legend/teto_legend.png"
    },
    {
        name: "☢️Cyberpunk Edgeruners💫",
        rarity: "Legendaria",
        probability: 1.59,
        img: "./legend/cyber_legend.png"
    },
    {
        name: "❤️🩷VOCALOIDS💛💙",
        rarity: "Legendaria",
        probability: 1.59,
        img: "./legend/voca_legend.jpg"
    }
];

// GIFs de animación por rareza
const rarityAnimations = {
    'común': './animations/miku.gif',
    'rara': './animations/miku.gif',
    'épica': './animations/miku.gif',
    'ultra rara': './animations/miku.gif',
    'Legendaria': './animations/miku.gif'
};

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
    // Verificar cooldown
    if (global.db.waifu.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.waifu.cooldowns[userId];
        if (timeDiff < 1800000) {
            const remainingTime = 1800000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ Debes esperar ${minutes}m ${seconds}s para volver a usar este comando.`);
        }
    }

    // Enviar mensaje de inicio
    await conn.sendMessage(m.chat, { text: "🎲 Invocando personaje..." });

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

    // Enviar animación según rareza
    try {
        const animationPath = rarityAnimations[selectedWaifu.rarity];
        await conn.sendMessage(m.chat, { 
            video: { url: animationPath },
            caption: "✨ Revelando rareza...",
            gifPlayback: true
        });

        // Pequeña pausa para efecto dramático
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
        console.log("Error al enviar animación:", e);
    }

    // Colores según rareza
    const rarityColors = {
        'común': '⚪',
        'rara': '🔵',
        'épica': '🟣',
        'ultra rara': '🟡',
        'Legendaria': '🔴'
    };

    // Probabilidades actualizadas
    const rarityProbs = {
        'común': '30%',
        'rara': '28%',
        'épica': '25%',
        'ultra rara': '12%',
        'Legendaria': '5%'
    };

    // Crear mensaje
    let message = `🎲 WAIFU GACHA 🎲\n\n`;
    message += `👤 Invocador: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedWaifu.rarity]} Rareza: ${selectedWaifu.rarity.toUpperCase()} (${rarityProbs[selectedWaifu.rarity]})\n`;
    message += `💫 ¡Felicidades! Obtuviste a:\n`;
    message += `💙 ${selectedWaifu.name}\n`;
    message += `\n💫 Usa .save para guardar tu waifu!`;

    // Enviar resultado final
    await conn.sendMessage(m.chat, { 
        image: { url: selectedWaifu.img },
        caption: message,
        mentions: [userId]
    });

    // Actualizar base de datos
    global.db.waifu.cooldowns[userId] = currentTime;
    global.db.waifu.waifus[userId] = selectedWaifu;
}

handler.help = ['rw']
handler.tags = ['rpg']
handler.command = /^(rw|rollwaifu)$/i
handler.group = true
handler.cooldown = 1800000

export default handler
