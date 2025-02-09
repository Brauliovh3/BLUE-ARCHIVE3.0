let handler = async (m, { conn }) => {
    const userId = m.sender;
    
    if (!global.db.waifu?.collection?.[userId]) {
        return m.reply('📝 Tu colección está vacía. Usa .rw para obtener personajes.');
    }

    try {
        const collection = global.db.waifu.collection[userId];
        
        // Contadores por rareza
        const rarityCount = {
            'Legendaria': 0,
            'ultra rara': 0,
            'épica': 0,
            'rara': 0,
            'común': 0
        };

        collection.forEach(waifu => rarityCount[waifu.rarity]++);

        // Crear mensaje con formato bonito
        let message = `╭━━━━『💙*VOCALOID COLLECTION*💙』━━━━╮\n\n`;
        
        // Mostrar resumen con barras de progreso
        message += `❯💙*RESUMEN DE COLECCIÓN*💙❮\n`;
        message += `\n┌──『 Rareza 』───『 Cantidad 』──┐\n`;
        message += `│ 🔴 Legendaria  │ ${rarityCount['Legendaria'].toString().padEnd(3)} │ ${createBar(rarityCount['Legendaria'], 10)} │\n`;
        message += `│ 🟡 Ultra Rara  │ ${rarityCount['ultra rara'].toString().padEnd(3)} │ ${createBar(rarityCount['ultra rara'], 10)} │\n`;
        message += `│ 🟣 Épica       │ ${rarityCount['épica'].toString().padEnd(3)} │ ${createBar(rarityCount['épica'], 10)} │\n`;
        message += `│ 🔵 Rara        │ ${rarityCount['rara'].toString().padEnd(3)} │ ${createBar(rarityCount['rara'], 10)} │\n`;
        message += `│ ⚪ Común       │ ${rarityCount['común'].toString().padEnd(3)} │ ${createBar(rarityCount['común'], 10)} │\n`;
        message += `└────────────────────────────┘\n\n`;

        // Total
        message += `📊 Total: ${collection.length} personajes\n\n`;

        // Mostrar personajes por rareza
        const rarityEmojis = {
            'Legendaria': '🔴',
            'ultra rara': '🟡',
            'épica': '🟣',
            'rara': '🔵',
            'común': '⚪'
        };

        // Agrupar por rareza
        const groupedByRarity = {};
        collection.forEach(waifu => {
            if (!groupedByRarity[waifu.rarity]) {
                groupedByRarity[waifu.rarity] = [];
            }
            groupedByRarity[waifu.rarity].push(waifu);
        });

        // Mostrar cada grupo
        for (const rarity of Object.keys(rarityCount)) {
            if (groupedByRarity[rarity]?.length > 0) {
                message += `╭─『 ${rarityEmojis[rarity]} ${rarity.toUpperCase()} 』\n`;
                groupedByRarity[rarity].forEach((waifu, index) => {
                    message += `│ ${(index + 1).toString().padStart(2)}. ${waifu.name}\n`;
                });
                message += `╰────────────\n`;
            }
        }

        message += `\n╰━━━━『 *FIN DE COLECCIÓN* 』━━━━╯`;
        
        return conn.reply(m.chat, message, m);

    } catch (e) {
        console.log(e);
        return m.reply('💙 Error al mostrar la colección. Intenta de nuevo.');
    }
}

// Función para crear barras de progreso
function createBar(value, maxSize) {
    const filled = Math.ceil((value / 20) * maxSize); // Asumiendo máximo de 20 por rareza
    const empty = maxSize - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

handler.help = ['collection', 'coleccion']
handler.tags = ['rpg']
handler.command = /^(collection|coleccion|col)$/i
handler.group = true

export default handler
