import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  generateWAMessageContent,
  getDevice
} = (await import("@whiskeysockets/baileys")).default;

const redes = "https://github.com/Brauliovh3"; 
const titulowm = "🌸 𝗧𝗮𝗰𝗵𝗶𝗯𝗮𝗻𝗮 𝗡𝗼𝘇𝗼𝗺𝗶 - 𝗕𝘂𝘀𝗰𝗮𝗱𝗼𝗿 𝗠𝘂𝗹𝘁𝗶𝗺𝗲𝗱𝗶𝗮 🌸";

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(message.chat, `
╭────────────────────────╮
│🌸 𝗧𝗔𝗖𝗛𝗜𝗕𝗔𝗡𝗔 𝗡𝗢𝗭𝗢𝗠𝗜 🌸│
╰────────────────────────╯

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃💫 Sistema de Búsqueda Activo┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎯 **¡Sensei!** Necesito que especifiques qué contenido deseas buscar en TikTok.

📝 **Uso correcto:**
\`${usedPrefix + command} [término de búsqueda]\`

📋 **Ejemplo:**
\`${usedPrefix + command} blue archive\`

> 🌟 *Millennium Science School - Sistema de Información Digital*`, message);
  }

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent({
      video: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return videoMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  try {
    
    const searchMessages = [
      '🔍 Analizando base de datos multimedia...',
      '📊 Procesando información de TikTok...',
      '💫 Accediendo a servidores de contenido...',
      '🎯 Clasificando resultados relevantes...',
      '✨ Preparando informe de búsqueda...'
    ];
    
    const randomSearchMsg = searchMessages[Math.floor(Math.random() * searchMessages.length)];

    conn.reply(message.chat, `
╭───────────────────────╮
│💙 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗗𝗘 𝗕𝗨́𝗦𝗤𝗨𝗘𝗗𝗔 💙│
╰───────────────────────╯

${randomSearchMsg}

🎪 **Búsqueda:** ${text}
⏰ **Estado:** En proceso...

> 🌸 *Por favor espera, Sensei*`, message, {
      contextInfo: { 
        externalAdReply: { 
          mediaUrl: null, 
          mediaType: 1, 
          showAdAttribution: true,
          title: '🌸 Tachibana Nozomi - Asistente Digital',
          body: '🎓 Millennium Science School | Sistema de Búsqueda',
          previewType: 0, 
          thumbnail: Buffer.alloc(0),
          sourceUrl: redes 
        }
      }
    });

    let results = [];
    let { data } = await axios.get("https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=" + text);
    let searchResults = data.data;
    
    if (!searchResults || searchResults.length === 0) {
      return conn.reply(message.chat, `
╭──────────────────────╮
│❌ 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢 𝗩𝗔𝗖𝗜́𝗢 ❌│
╰──────────────────────╯

🔍 **Búsqueda:** ${text}
📊 **Resultados encontrados:** 0

💡 **Sugerencias:**
• Verifica la ortografía del término
• Usa palabras más generales
• Intenta con sinónimos
• Revisa que el contenido exista

> 🌸 *Lo siento, Sensei. No encontré contenido relacionado*`, message);
    }

    shuffleArray(searchResults);
    let topResults = searchResults.splice(0, 7);

    for (let result of topResults) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: titulowm }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: `🎪 ${result.title}\n\n🌟 Contenido verificado por Nozomi\n📊 Calidad: Premium`,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.nowm)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      });
    }

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `
╭────────────────────────╮
│✅ 𝗕𝗨́𝗦𝗤𝗨𝗘𝗗𝗔 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗗𝗔 ✅│
╰────────────────────────╯

🎯 **Término:** ${text}
📊 **Resultados:** ${topResults.length} videos seleccionados
🌟 **Calidad:** Verificada por Millennium

> 🌸 *¡Desliza para ver todos los resultados, Sensei!*`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "🎓 Millennium Science School | 🌸 Tachibana Nozomi | 💙 Blue Archive"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: [...results]
            })
          })
        }
      }
    }, {
      quoted: message
    });

    await conn.relayMessage(message.chat, messageContent.message, {
      messageId: messageContent.key.id
    });

    // Reaccionar al mensaje original
    await message.react('🌸');

  } catch (error) {
    console.error(error);
    conn.reply(message.chat, `
╭─────────────────────╮
│⚠️ 𝗘𝗥𝗥𝗢𝗥 𝗗𝗘𝗟 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 ⚠️│
╰─────────────────────╯

❌ **Error detectado en el sistema de búsqueda**

🔧 **Detalles técnicos:**
\`${error.message}\`

💡 **Posibles soluciones:**
• Intenta nuevamente en unos momentos
• Verifica tu conexión a internet
• Usa términos de búsqueda diferentes
• Contacta al administrador si persiste

> 🌸 *Lo siento, Sensei. Reportando error al equipo técnico...*`, message);
  }
};

handler.help = ["tiktoksearch <texto>", "buscar-tiktok <texto>"];
handler.chocolates = 1;
handler.register = true;
handler.tags = ["search"];
handler.command = ["tiktoksearch", "tts", "tiktoks", "buscar-tiktok", "search-tiktok"];
export default handler;
