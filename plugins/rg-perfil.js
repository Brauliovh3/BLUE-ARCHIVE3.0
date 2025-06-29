import { canLevelUp, xpRange } from '../lib/levelling.js'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
import fs from 'fs'
import axios from 'axios' 


function generateProgressBar(percentage) {
  if (isNaN(percentage) || percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;
  
  let filled = Math.floor(percentage / 10);
  let empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function getAcademicRank(level) {
  if (!level || isNaN(level)) return 'Estudiante en Prueba';
  
  if (level >= 100) return 'Estudiante Veterano';
  if (level >= 50) return 'Estudiante Avanzado';
  if (level >= 25) return 'Estudiante Intermedio';
  if (level >= 10) return 'Estudiante Principiante';
  return 'Estudiante en Prueba';
}

function getRankEmoji(level) {
  if (!level || isNaN(level)) return '🔰';
  
  if (level >= 100) return '👑';
  if (level >= 50) return '⭐';
  if (level >= 25) return '🌟';
  if (level >= 10) return '✨';
  return '🔰';
}

function formatText(text, maxLength = 28) {
  if (!text || typeof text !== 'string') return ' '.repeat(maxLength);
  return text.substring(0, maxLength).padEnd(maxLength);
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  return num.toLocaleString();
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    
   
    if (!global.db || !global.db.data || !global.db.data.users) {
      return m.reply(`❌ Error: Base de datos no disponible.`);
    }
    
    let user = global.db.data.users[who];
    if (!user) {
      return m.reply(`❌ Datos del estudiante no encontrados.\n*Student data not found.*`);
    }
    
    
    let { 
      exp = 0, 
      limit = 0, 
      name = 'Estudiante Sin Nombre', 
      registered = false, 
      age = 0, 
      level = 1 
    } = user;
    
   
    let levelInfo;
    try {
      levelInfo = xpRange(level, global.multiplier || 1);
    } catch (err) {
      console.error('Error en xpRange:', err);
      levelInfo = { min: 0, xp: 100 };
    }
    
    let { min, xp } = levelInfo;
    let username = conn.getName(who) || 'Usuario Desconocido';
    let prem = global.prems ? global.prems.includes(who.split`@`[0]) : false;
    
   
    let bio = await conn.fetchStatus(who).catch(_ => ({ status: 'Vida diaria en Kivotos' }));
    let biot = bio.status || 'Sin estado';
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://i.ibb.co/tqWV67y/file.jpg');
  
    
    let phoneFormatted = 'No disponible';
    try {
      let phoneNum = new PhoneNumber('+' + who.replace('@s.whatsapp.net', ''));
      if (phoneNum.isValid()) {
        phoneFormatted = phoneNum.getNumber('international');
      }
    } catch (err) {
      console.error('Error al formatear teléfono:', err);
    }
    
    
    let userNationality = 'Desconocido';
    if (phoneFormatted !== 'No disponible') {
      try {
        let api = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/country?text=${phoneFormatted}`, {
          timeout: 5000
        });
        let userNationalityData = api.data?.result;
        if (userNationalityData && userNationalityData.name) {
          userNationality = `${userNationalityData.name} ${userNationalityData.emoji || ''}`;
        }
      } catch (err) {
        console.error('Error al obtener la nacionalidad:', err);
      }
    }

   
    let xpProgress = 0;
    if (xp > 0 && exp >= min) {
      xpProgress = Math.floor(((exp - min) / xp) * 100);
      xpProgress = Math.max(0, Math.min(100, xpProgress));
    }
    
    let progressBar = generateProgressBar(xpProgress);
    let academicRank = getAcademicRank(level);
    let rankEmoji = getRankEmoji(level);
    
   
    let txt = `╭─「📋 BASE DE DATOS SCHALE─╮\n`;
    txt += `│                                       │\n`;
    txt += `│💠 PERFIL ESTUDIANTIL 💠│\n`;
    txt += `│                                       │\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 👤 Nombre del Estudiante│\n`;
    txt += `│ ➤ ${formatText(name)}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 🎂 Edad                 │\n`;
    txt += `│ ➤ ${formatText(registered ? `${age} años` : 'No registrado')}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 📱 Número de Contacto   │\n`;
    txt += `│ ➤ ${formatText(phoneFormatted)}│\n`;
    txt += `├──────────────────────────┤\n`;
    txt += `│ 🌍 Nacionalidad          │\n`;
    txt += `│ ➤ ${formatText(userNationality)}│\n`;
    txt += `├──────────────────────────┤\n`;
    txt += `│ ${rankEmoji} Grado Académico│\n`;
    txt += `│ ➤ ${formatText(`${academicRank} - Nivel ${level}`)}│\n`;
    txt += `├──────────────────────────┤\n`;
    txt += `│ ⭐ Experiencia Acumulada│\n`;
    txt += `│ ➤ ${formatText(`${formatNumber(exp)} XP Total`)}│\n`;
    txt += `│ ➤ ${progressBar} ${xpProgress.toString().padStart(3)}%│\n`;
    txt += `│ ➤ ${formatText(`${formatNumber(exp - min)}/${formatNumber(xp)} siguiente`)}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 🎫 Créditos Estudiantiles│\n`;
    txt += `│ ➤ ${formatText(`${formatNumber(limit)} Créditos`)}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ ⭐ Estado Premium      │\n`;
    txt += `│ ➤ ${formatText(prem ? '✅ Activo' : '❌ Inactivo')}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 📝 Estado de Registro  │\n`;
    txt += `│ ➤ ${formatText(registered ? '✅ Registrado' : '❌ Sin registrar')}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 💬 Estado Personal│\n`;
    txt += `│ ➤ ${formatText(`"${biot.substring(0, 24)}"`)}│\n`;
    txt += `├─────────────────────────┤\n`;
    txt += `│ 🔗 Enlace de Contacto  │\n`;
    txt += `│ ➤ ${formatText(`wa.me/${who.split`@`[0]}`)}│\n`;
    txt += `╰─────────────────────────╯\n`;
    txt += `\n🏫 *SCHALE* - Academia General de Kivotos\n`;
    txt += `📅 Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES', { hour12: false })}`;

   
    let img = await (await fetch(pp)).buffer();
    await conn.sendFile(m.chat, img, 'student_profile.jpg', txt, m, false, { mentions: [who] });
    
  } catch (error) {
    console.error('Error detallado en el comando de perfil:', error);
    
    
    let errorMsg = '❌ Ocurrió un error al generar el perfil.\n';
    if (error.message) {
      errorMsg += `*Error: ${error.message}*`;
    }
    
    m.reply(errorMsg);
  }
};

handler.help = ['perfil', 'perfil *@user*'];
handler.tags = ['rg'];
handler.command = /^(perfil|profile|student)$/i;
handler.register = true;

export default handler;
