import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!args[0]) return conn.reply(m.chat, `💚  Ingresa un link de tiktok que contenga imagenes`, m, rcanal)
    if (!args[0].match(/tiktok/gi)) return conn.reply(m.chat, `💚  Verifica que el link sea de TikTok`, m, rcanal)
    
    await m.react('🕓')
    
    try {
        let { username, views, comments, shares, downloads, profile, dl_urls } = await Starlights.tiktokdlV2(args[0])
        
        
        if (!dl_urls || dl_urls.length === 0) {
            await m.react('✖️')
            return conn.reply(m.chat, `💚  No se encontraron imágenes en este TikTok`, m, rcanal)
        }
        
        let txt = '`💚  T I K T O K - I M G  💚`\n\n'
        txt += `\t\t*» Usuario* : ${username}\n`
        txt += `\t\t*» Visitas* : ${views}\n`
        txt += `\t\t*» Comentarios* : ${comments}\n`
        txt += `\t\t*» Compartidos* : ${shares}\n`
        txt += `\t\t*» Descargas* : ${downloads}\n`
        
        
        for (let i = 0; i < dl_urls.length; i++) {
            try {
                const url = dl_urls[i].dl_url || dl_urls[i]
                
                
                const isImage = url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp')
                
                if (isImage) {
                    await conn.sendFile(m.chat, url, `tiktokimg${i + 1}.jpg`, txt, m, null, rcanal)
                } else {
                    
                    const response = await fetch(url, { method: 'HEAD' })
                    const contentType = response.headers.get('content-type')
                    
                    if (contentType && contentType.startsWith('image/')) {
                        const extension = contentType.split('/')[1] || 'jpg'
                        await conn.sendFile(m.chat, url, `tiktokimg${i + 1}.${extension}`, txt, m, null, rcanal)
                    } else {
                        console.log(`URL ${i + 1} no es una imagen: ${contentType}`)
                    }
                }
            } catch (imgError) {
                console.log(`Error procesando imagen ${i + 1}:`, imgError)
            }
        }
        
        await m.react('✅')
        
    } catch (error) {
        console.error('Error en tiktokimg:', error)
        await m.react('✖️')
        conn.reply(m.chat, `💚  Error al procesar el TikTok. Verifica que el link contenga imágenes.`, m, rcanal)
    }
}

handler.help = ['tiktokimg *<url tt>*']
handler.tags = ['downloader']
handler.command = ['tiktokimg', 'tiktokimgs', 'ttimg', 'ttimgs']
handler.register = true

export default handler
