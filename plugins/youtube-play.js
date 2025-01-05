import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'

const LimitAud = 725 * 1024 * 1024 // 700MB
const LimitVid = 425 * 1024 * 1024 // 425MB

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `Por favor, ingresa el nombre o enlace del video de YouTube que deseas buscar.\n*${usedPrefix + command} Billie Eilish - Bellyache*`, m)
    
    const tipoDescarga = command === 'play' ? 'audio' : command === 'play2' ? 'video' : command === 'play3' ? 'audio doc' : command === 'play4' ? 'video doc' : '';
    const yt_play = await search(args.join(' '))
    const ytplay2 = await yts(text)

    const texto1 = `⌘━─━─≪ *YOUTUBE* ≫─━─━⌘
★ Título: ${yt_play[0].title}
★ Fecha de publicación: ${yt_play[0].ago}
★ Duración: ${secondString(yt_play[0].duration.seconds)}
★ Vistas: ${MilesNumber(yt_play[0].views)}
★ Autor: ${yt_play[0].author.name}
★ Enlace: ${yt_play[0].url.replace(/^https?:\/\//, '')}
⌘━━─≪ ${command} ≫─━━⌘

> _*Descargando ${tipoDescarga}.... Aguarde un momento por favor*_`.trim()

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m)

   // Audio download
if (command == 'play' || command == 'audio') {
    try {    
        let searchh = await yts(yt_play[0].url);
        let __res = searchh.all.map(v => v).filter(v => v.type == "video");
        let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'audioonly' });
        await conn.sendMessage(m.chat, { audio: { url: ress.url }, mimetype: 'audio/mpeg' }, { quoted: m });
    } catch (e1) {
        try {    
            const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${yt_play[0].url}`);
            let { result } = await res.json();
            await conn.sendMessage(m.chat, { audio: { url: await result.download.url }, mimetype: 'audio/mpeg' }, { quoted: m });
        } catch (e1) {
            console.error("Error al descargar el audio", e1);
        }
    }
}

// Video download
if (command == 'play2' || command == 'video') {
    try {    
        let searchh = await yts(yt_play[0].url);
        let __res = searchh.all.map(v => v).filter(v => v.type == "video");
        let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'videoonly' });
        await conn.sendMessage(m.chat, { video: { url: await ress.url }, fileName: `${yt_play[0].title}.mp4`, mimetype: 'video/mp4', caption: `⟡ *${yt_play[0].title}*\n> ${wm}` }, { quoted: m });
    } catch (e1) {
        console.error("Error al descargar el video", e1);
    }
}

// Document download for audio
if (command == 'play3' || command == 'playdoc') {
    try {    
        let searchh = await yts(yt_play[0].url);
        let __res = searchh.all.map(v => v).filter(v => v.type == "video");
        let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'audioonly' });
        await conn.sendMessage(m.chat, { document: { url: ress.url }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3` }, { quoted: m });
    } catch (e1) {
        console.error("Error al descargar el audio como documento", e1);
    }
}

// Video document download
if (command == 'play4' || command == 'playdoc2') {
    try {
        let searchh = await yts(yt_play[0].url);
        let __res = searchh.all.map(v => v).filter(v => v.type == "video");
        let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'videoonly' });
        await conn.sendMessage(m.chat, { document: { url: ress.url }, fileName: `${yt_play[0].title}.mp4`, caption: `╭━❰  ${wm}  ❱━⬣\n┃ 💜 Título: ${yt_play[0].title}\n╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`, thumbnail: yt_play[0].thumbnail, mimetype: 'video/mp4' }, { quoted: m });
    } catch (e1) {
        console.error("Error al descargar el video como documento", e1);
    }
}
