import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!args[0]) return conn.reply(m.chat, `💚 Ingresa un link de tiktok que contenga imagenes`, m, rcanal)
    if (!args[0].match(/tiktok/gi)) return conn.reply(m.chat, `💚 Verifica que el link sea de TikTok`, m, rcanal)
    
    await m.react('🕓')
    
    try {
        
        let result = await Starlights.tiktokimg(args[0])
        
        
        if (!result || !result.images || result.images.length === 0) {
            await m.react('✖️')
            return conn.reply(m.chat, `💚 Este TikTok no contiene imágenes o no se pudieron obtener`, m, rcanal)
        }
        
        let txt = '`💚T I K T O K - I M G💚`\n\n'
        txt += `\t\t*» Usuario* : ${result.username || 'N/A'}\n`
        txt += `\t\t*» Descripción* : ${result.title || 'N/A'}\n`
        txt += `\t\t*» Imágenes* : ${result.images.length}\n`
        
        
        for (let i = 0; i < result.images.length; i++) {
            await conn.sendFile(m.chat, result.images[i], `tiktokimg${i + 1}.jpg`, txt, m, null, rcanal)
        }
        
        await m.react('✅')
        
    } catch (error) {
        console.error('Error en tiktokimg:', error)
        await m.react('✖️')
        
        
        try {
            let backup = await Starlights.tiktokdl(args[0])
            
            if (backup && backup.images && backup.images.length > 0) {
                let txt = '`💚T I K T O K - I M G💚`\n\n'
                txt += `\t\t*» Usuario* : ${backup.username || 'N/A'}\n`
                txt += `\t\t*» Imágenes* : ${backup.images.length}\n`
                
                for (let i = 0; i < backup.images.length; i++) {
                    await conn.sendFile(m.chat, backup.images[i], `tiktokimg${i + 1}.jpg`, txt, m, null, rcanal)
                }
                
                await m.react('✅')
            } else {
                conn.reply(m.chat, `💚 No se pudieron descargar las imágenes. Verifica que el link contenga imágenes.`, m, rcanal)
            }
        } catch {
            conn.reply(m.chat, `💚 Error al procesar el link. Intenta con otro enlace.`, m, rcanal)
        }
    }
}

handler.help = ['tiktokimg *<url tt>*']
handler.tags = ['downloader']
handler.command = ['tiktokimg', 'tiktokimgs', 'ttimg', 'ttimgs']
handler.register = true

export default handler
