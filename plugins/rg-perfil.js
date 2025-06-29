import { canLevelUp, xpRange } from '../lib/levelling.js'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
import fs from 'fs'
import axios from 'axios' 


function generateProgressBar(percentage) {
  let filled = Math.floor(percentage / 10);
  let empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function getAcademicRank(level) {
  if (level >= 100) return 'Estudiante Veterano';
  if (level >= 50) return 'Estudiante Avanzado';
  if (level >= 25) return 'Estudiante Intermedio';
  if (level >= 10) return 'Estudiante Principiante';
  return 'Estudiante en Prueba';
}

function getRankEmoji(level) {
  if (level >= 100) return '👑';
  if (level >= 50) return '⭐';
  if (level >= 25) return '🌟';
  if (level >= 10) return '✨';
  return '🔰';
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let user = global.db.data.users[who];
    
    if (!user) {
      return m.reply(`❌ Datos del estudiante no encontrados.\n*Student data not found.*`);
    }
    
    let { exp, limit, name, registered, age, level } = user;
    let { min, xp } = xpRange(user.level, global.multiplier);
    let username = conn.getName(who);
    let prem = global.prems.includes(who.split`@`[0]);
    let bio = await conn.fetchStatus(who).catch(_ => ({ status: 'Vida diaria en Kivotos' }));
    let biot = bio.status;
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://i.ibb.co/tqWV67y/file.jpg');
  
    let phoneNum = new PhoneNumber('+' + who.replace('@s.whatsapp.net', ''));
    let phoneFormatted = phoneNum.getNumber('international');
    
    let userNationality = 'Desconocido';
    try {
      let api = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/country?text=${phoneFormatted}`);
      let userNationalityData = api.data.result;
      if (userNationalityData) {
        userNationality = `${userNationalityData.name} ${userNationalityData.emoji}`;
      }
    } catch (err) {
      console.error('Error al obtener la nacionalidad:', err);
    }

   
    let xpProgress = xp > 0 ? Math.floor(((exp - min) / xp) * 100) : 0;
    let progressBar = generateProgressBar(xpProgress);
    
    
    let academicRank = getAcademicRank(level);
    let rankEmoji = getRankEmoji(level);
    
    
    let txt = `╭─「 📋 BASE DE DATOS SCHALE 」─╮\n`;
    txt += `│                                    │\n`;
    txt += `│     💠 PERFIL ESTUDIANTIL 💠     │\n`;
    txt += `│                                    │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 👤 Nombre del Estudiante           │\n`;
    txt += `│ ➤ ${(name || 'Estudiante Desconocido').substring(0, 28).padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 🎂 Edad                            │\n`;
    txt += `│ ➤ ${(registered ? `${age} años` : 'No registrado').padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 📱 Número de Contacto              │\n`;
    txt += `│ ➤ ${phoneFormatted.substring(0, 28).padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 🌍 Nacionalidad                    │\n`;
    txt += `│ ➤ ${userNationality.substring(0, 28).padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ ${rankEmoji} Grado Académico                │\n`;
    txt += `│ ➤ ${academicRank.padEnd(20)} Lv.${level.toString().padStart(3)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ ⭐ Experiencia Acumulada           │\n`;
    txt += `│ ➤ ${exp.toLocaleString().padEnd(15)} XP Total     │\n`;
    txt += `│ ➤ ${progressBar} ${xpProgress.toString().padStart(3)}%          │\n`;
    txt += `│ ➤ ${(exp - min).toLocaleString()}/${xp.toLocaleString()} al siguiente nivel        │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 🎫 Créditos Estudiantiles          │\n`;
    txt += `│ ➤ ${limit.toLocaleString().padEnd(20)} Créditos   │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ ⭐ Estado Premium                  │\n`;
    txt += `│ ➤ ${(prem ? '✅ Activo' : '❌ Inactivo').padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 📝 Estado de Registro              │\n`;
    txt += `│ ➤ ${(registered ? '✅ Registrado' : '❌ Sin registrar').padEnd(28)} │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 💬 Estado Personal                 │\n`;
    txt += `│ ➤ "${biot.substring(0, 26)}"${biot.length > 26 ? '...' : ''}   │\n`;
    txt += `├────────────────────────────────────┤\n`;
    txt += `│ 🔗 Enlace de Contacto              │\n`;
    txt += `│ ➤ wa.me/${who.split`@`[0].padEnd(20)}        │\n`;
    txt += `╰────────────────────────────────────╯\n`;
    txt += `\n🏫 *SCHALE* - Academia General de Kivotos\n`;
    txt += `📅 Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour12: false })}`;

    let img = await (await fetch(pp)).buffer();
    await conn.sendFile(m.chat, img, 'student_profile.jpg', txt, m, false, { mentions: [who] });
    
  } catch (error) {
    console.error('Error en el comando de perfil:', error);
    m.reply('❌ Ocurrió un error al generar el perfil.\n*An error occurred while generating the profile.*');
  }
};

handler.help = ['perfil', 'perfil *@user*'];
handler.tags = ['rg'];
handler.command = /^(perfil|profile|student)$/i;
handler.register = true;

export default handler;
