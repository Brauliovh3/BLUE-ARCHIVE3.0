let handler = async (m, { conn }) => {
    const userId = m.sender;
    
    // Verificar si existe la base de datos
    if (!global.db.waifu) {
        return m.reply('💙 Error del sistema. La base de datos de waifus no está inicializada.');
    }
    
    try {
        // Verificar si el usuario tiene una colección
        if (!global.db.waifu.collection[userId] || global.db.waifu.collection[userId].length === 0) {
            return m.reply('📝 Tu colección está vacía. Usa .rw para obtener personajes.');
        }

        // Ordenar la colección por rareza
        const sortedCollection = [...global.db.waifu.collection[userId]].sort((a, b) => {
            const rarityOrder = {
                'Legendaria': 0,
                'ultra rara': 1,
                'épica': 2,
                'rara': 3,
                'común': 4
            };
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });

        // Contar personajes por rareza
        const rarityCount = {
            'Legendaria': 0,
            'ultra rara': 0,
            'épica': 0,
            'rara': 0,
            'común': 0
        };

        sortedCollection.forEach(waifu => {
            rarityCount[waifu.rarity]++;
        });

        // Crear mensaje
        let message = `🎲 *TU COLECCIÓN DE VOCALOIDS* 🎲\n\n`;
        message += `📊 *Resumen de Colección:*\n`;
        message += `🔴 Legendarias (1%): ${rarityCount['Legendaria']}\n`;
        message += `🟡 Ultra Raras (10%): ${rarityCount['ultra rara']}\n`;
        message += `🟣 Épicas (25%): ${rarityCount['épica']}\n`;
        message += `🔵 Raras (30%): ${rarityCount['rara']}\n`;
        message += `⚪ Comunes (35%): ${rarityCount['común']}\n`;
        message += `📚 Total en colección: ${sortedCollection.length}\n\n`;
        message += `📝 *Lista de Personajes:*\n`;

        // Agrupar por rareza
        const rarityEmojis = {
            'Legendaria': '🔴',
            'ultra rara': '🟡',
            'épica': '🟣',
            'rara': '🔵',
            'común': '⚪'
        };

        let currentRarity = '';
        sortedCollection.forEach((waifu, index) => {
            if (currentRarity !== waifu.rarity) {
                currentRarity = waifu.rarity;
                message += `\n${rarityEmojis[waifu.rarity]} *${waifu.rarity.toUpperCase()}*:\n`;
            }
            message += `${index + 1}. ${waifu.name}\n`;
        });

        return m.reply(message);
    } catch (e) {
        console.log(e);
        return m.reply('💙 Error al mostrar la colección. Intenta de nuevo.');
    }
}

handler.help = ['collection', 'coleccion']
handler.tags = ['rpg']
handler.command = /^(collection|coleccion|col)$/i
handler.group = true

export default handler