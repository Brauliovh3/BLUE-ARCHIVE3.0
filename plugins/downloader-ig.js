import fetch from 'node-fetch';
import axios from 'axios';
import { instagramdl } from '@bochilteam/scraper';
import { fileTypeFromBuffer } from 'file-type';

const userRequests = {};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  if (!args[0]) {
    return conn.reply(m.chat, '💙 *Ingresa un link de Instagram* 💙\n\nEjemplo: *' + usedPrefix + command + '* https://www.instagram.com/p/C60xXk3J-sb/?igsh=YzljYTk1ODg3Zg==', m);
  }

 
  if (userRequests[m.sender]) {
    return conn.reply(m.chat, '⏳ *Espera...* Ya hay una solicitud en proceso. Por favor, espera a que termine antes de hacer otra.', m);
  }
  userRequests[m.sender] = true;

  try {
    
    await m.react('🎵');
    conn.reply(m.chat, '💙 𝙃𝙖𝙩𝙨𝙪𝙣𝙚 𝙈𝙞𝙠𝙪 𝙚𝙨𝙩𝙖́ 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤... 💙', m);

    
    const res = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${args}`);
    const data = await res.json();

    
    if (!data.data || data.data.length === 0) {
      throw new Error('No se encontraron medios en la respuesta de la API');
    }

    
    const fileType = data.data[0].url.includes('.webp') ? 'image' : 'video';
    const downloadUrl = data.data[0].url;

    
    if (fileType === 'image') {
      await conn.sendFile(m.chat, downloadUrl, 'ig.jpg', '💙💙💙💙💙💙💙💙💙💙💙💙\n𝙃𝙖𝙩𝙨𝙪𝙣𝙚 𝙈𝙞𝙠𝙪 𝙩𝙧𝙖𝙟𝙤 𝙩𝙪 𝙞𝙢𝙖𝙜𝙚𝙣\n💙💙💙💙💙💙💙💙💙💙💙💙', m);
      await m.react('✅');
    } else if (fileType === 'video') {
      await conn.sendFile(m.chat, downloadUrl, 'ig.mp4', '💙💙💙💙💙💙💙💙💙💙💙💙\n𝙃𝙖𝙩𝙨𝙪𝙣𝙚 𝙈𝙞𝙠𝙪 𝙩𝙧𝙖𝙟𝙤 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤\n💙💙💙💙💙💙💙💙💙💙💙💙', m);
      await m.react('✅');
    }

  } catch (e) {
    
    await m.react('🎀');
    conn.reply(m.chat, '💙 ¡Oops! Miku-chan tuvo un problema al descargar tu video. Intenta de nuevo. 💙', m);
    console.error(e); 
  } finally {
    
    delete userRequests[m.sender];
  }
}


handler.help = ['instagram *<link ig>*'];
handler.tags = ['downloader'];
handler.command = /^(instagramdl|instagram|igdl|ig|instagramdl2|instagram2|igdl2|ig2|instagramdl3|instagram3|igdl3|ig3)$/i;
handler.limit = 1;
handler.register = true;

export default handler;


const getBuffer = async (url, options) => {
  options = options || {};
  const res = await axios({
    method: 'get',
    url,
    headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
    ...options,
    responseType: 'arraybuffer'
  });
  const buffer = Buffer.from(res.data, 'binary');
  const detectedType = await fileTypeFromBuffer(buffer);
  if (!detectedType || (detectedType.mime !== 'image/jpeg' && detectedType.mime !== 'image/png' && detectedType.mime !== 'video/mp4')) {
    return null;
  }
  return { buffer, detectedType };
};
