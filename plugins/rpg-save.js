let handler = async (m, { conn }) => {
    const userId = m.sender;
    
    // Verificar si existe la base de datos
    if (!global.db.waifu) {
        return m.reply('💙 Error del sistema. Intenta usar .rw primero.');
    }

    try {
        // Verificar si el usuario está respondiendo a un mensaje
        if (m.quoted) {
            // Verificar si el mensaje es del bot
            if (!m.quoted.fromMe) {
                return m.reply('💙 Debes responder a un mensaje del bot que muestre un personaje.');
            }

            // Obtener el waifuId del mensaje citado
            const currentWaifuOwner = Object.keys(global.db.waifu.waifus).find(key => 
                global.db.waifu.waifus[key] && 
                global.db.waifu.waifus[key].messageId === m.quoted.id
            );

            // Si la waifu existe pero pertenece a otro usuario
            if (currentWaifuOwner && currentWaifuOwner !== userId) {
                return m.reply('💙 No puedes reclamar este personaje. Pertenece a otro usuario.');
            }

            // Si no hay una waifu disponible para reclamar
            if (!global.db.waifu.waifus[userId]) {
                return m.reply('💙 No hay personaje disponible para guardar o ya fue reclamado.');
            }
        } else {
            return m.reply('💙 Debes responder al mensaje donde se mostró el personaje.');
        }

        // Inicializar colección si no existe
        if (!global.db.waifu.collection) global.db.waifu.collection = {};
        if (!global.db.waifu.collection[userId]) {
            global.db.waifu.collection[userId] = [];
        }

        const currentWaifu = global.db.waifu.waifus[userId];

        // Verificar si la waifu ya existe en la colección
        const waifuExists = global.db.waifu.collection[userId].some(
            waifu => waifu.name === currentWaifu.name && waifu.rarity === currentWaifu.rarity
        );

        if (waifuExists) {
            delete global.db.waifu.waifus[userId];
            return m.reply('💙 Ya tiene este personaje en su colección.');
        }

        // Guardar waifu en la colección
        global.db.waifu.collection[userId].push({
            ...currentWaifu,
            obtainedAt: new Date().toISOString()
        });

        // Eliminar la waifu reclamada
        delete global.db.waifu.waifus[userId];

        // Mensaje de éxito
        let message = `✅ ¡VOCALOID GUARDADA! ✅\n\n`;
        message += `💌 Waifu: ${currentWaifu.name}\n`;
        message += `✨ Rareza: ${currentWaifu.rarity.toUpperCase()}\n`;
        message += `📚 Total en colección: ${global.db.waifu.collection[userId].length}\n`;
        message += `💙 Usa .col o .coleccion para ver tus colecciones`;
        
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
