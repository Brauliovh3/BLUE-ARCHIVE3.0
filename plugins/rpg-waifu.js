import { promises as fs } from 'fs';

global.db = global.db || {};
global.db.waifu = global.db.waifu || {
    cooldowns: {},
    waifus: {},
    collection: {}
};


const waifuList = [
   
    {
        name: "Hatsune Chibi",
        rarity: "común",
        probability: 5,  
        img: "./storage/chibis/miku_chibi.png"
    },
    {
        name: "Neru Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/neru_chibi.png"
    },
    {
        name: "Rin Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/rin_chibi.png"
    },
    {
        name: "Teto Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/teto_chibi.png"
    },
    {
        name: "Emu Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/emu_chibi.png"
    },
    {
        name: "Len Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/len_chibi.png"
    },
    {
        name: "Luka Chibi",
        rarity: "común",
        probability: 5,
        img: "./storage/chibis/luka_chibi.png"
    },
    
    
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/miku_raro.png"
    },
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/miku_raro.png"
    },
    {
        name: "Akita Neru 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/neru_raro.png"
    },
    {
        name: "Rin",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/rin_raro.png"
    },
    {
        name: "Teto",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/teto_raro.png"
    },
    {
        name: "Emu Otori",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/emu_raro.png"
    },
    {
        name: "Len",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/len_raro.png"
    },
    {
        name: "Luka Megurine 2006",
        rarity: "rara",
        probability: 4.285,
        img: "./storage/raros/luka_raro.png"
    },
    
    
    {
        name: "💙Miku💙",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/miku_epico.png"
    },
    {
        name: "💛Neru💛",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/neru_epico.png"
    },
    {
        name: "💛Rin💛",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/rin_epico.png"
    },
    {
        name: "❤Teto❤",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/teto_epico.png"
    },
    {
        name: "💗Emu💗",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/emu_epico.png"
    },
    {
        name: "Len (gei)",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/len_epico.png"
    },
    {
        name: "💗LUKA🪷",
        rarity: "épica",
        probability: 2.857,
        img: "./storage/epicos/luka_epico.png"
    },
   
    
    {
        name: "💙HATSUNE MIKU💙",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/miku_ultra.png"
    },
    {
        name: "💛AKITA NERU💛",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/neru_ultra.png"
    },
    {
        name: "💗EMU OTORI💗",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/emu_ultra.png"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/teto_ultra.png"
    },
    {
        name: "💛KAGAMINE RIN💛",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/rin_ultra.png"
    },
    {
        name: "💥KAGAMINE LEN💢",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/len_ultra.png"
    },
    {
        name: "💗MEGUMIRE LUKA💮",
        rarity: "ultra rara",
        probability: 1.429,
        img: "./storage/ultra/luka_ultra.png"
    },
    
    
    {
        name: "💙Brazilian Miku💛",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/miku_legend.jpg" 
    },
    {
        name: "🖤Inabakumori🖤",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/ibana_legend.jpg"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/teto_legend.png"
    },
    {
        name: "☢️Cyberpunk Edgeruners💫",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/cyber_legend.png"
    },
    {
        name: "❤️🩷VOCALOIDS💛💙",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/voca_legend.jpg"
    },
    {
        name: "🏴‍☠️🌌HALO⚕️☢️",
        rarity: "Legendaria",
        probability: 0.833,
        img: "./storage/legend/halo_legend.png"
    }
];


let totalProbability = 0;
for (const waifu of waifuList) {
    totalProbability += waifu.probability;
}
console.log(`Probabilidad total: ${totalProbability.toFixed(3)}%`); 

const rarityAnimations = {
    'común': './storage/animations/miku.gif',
    'rara': './storage/animations/miku.gif',
    'épica': './storage/animations/miku.gif',
    'ultra rara': './storage/animations/miku.gif',
    'Legendaria': './storage/animations/miku.gif'
};

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
   
    if (global.db.waifu.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.waifu.cooldowns[userId];
        if (timeDiff < 900000) {
            const remainingTime = 900000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ Debes esperar ${minutes}m ${seconds}s para volver a usar este comando.`);
        }
    }

    
    await conn.sendMessage(m.chat, { text: "💮 Invocando personaje..." });

   
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
    
    
    if (!selectedWaifu) {
        selectedWaifu = waifuList[waifuList.length - 1];
        console.log("Warning: No se seleccionó waifu, usando el último de la lista");
    }

   
    console.log(`Roll: ${roll.toFixed(2)}, Rareza: ${selectedWaifu.rarity}, Nombre: ${selectedWaifu.name}`);

    
    try {
        const animationPath = rarityAnimations[selectedWaifu.rarity];
        await conn.sendMessage(m.chat, { 
            video: { url: animationPath },
            caption: "🏅 Revelando rareza...",
            gifPlayback: true
        });

       
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
        console.log("Error al enviar animación:", e);
    }

    
    const rarityColors = {
        'común': '⚪',
        'rara': '🔵',
        'épica': '🟣',
        'ultra rara': '🟡',
        'Legendaria': '🔴'
    };

   
    const rarityProbs = {
        'común': '35%',
        'rara': '30%',
        'épica': '20%',
        'ultra rara': '10%',
        'Legendaria': '5%'
    };

  
    let message = `🎲 WAIFU GACHA 🎲\n\n`;
    message += `👤 Invocador: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedWaifu.rarity]} Rareza: ${selectedWaifu.rarity.toUpperCase()} (${rarityProbs[selectedWaifu.rarity]})\n`;
    message += `💫 ¡Felicidades! Obtuviste a:\n`;
    message += `💙 ${selectedWaifu.name}\n`;
    message += `\n💫 Usa .save o .c para guardar tu waifu!`;

  
    await conn.sendMessage(m.chat, { 
        image: { url: selectedWaifu.img },
        caption: message,
        mentions: [userId]
    });

  
    global.db.waifu.cooldowns[userId] = currentTime;
    global.db.waifu.waifus[userId] = selectedWaifu;
}

handler.help = ['rw']
handler.tags = ['rpg']
handler.command = /^(rw|rollwaifu)$/i
handler.register = true
handler.group = true
handler.cooldown = 900000

export default handler
