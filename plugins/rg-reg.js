import { createHash } from 'crypto'
import fs from 'fs'
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  
  if (user.registered === true) return m.reply(`💚 ¡Ya estás registrado en Kivotos Academy, Sensei!`)
  
  if (!Reg.test(text)) return m.reply(`*💚 KIVOTOS ACADEMY - REGISTRO DE SENSEI*\n\n` +
    `*Por favor, ingresa tu nombre y edad para unirte a la academia.*\n\n` +
    `*📋 Formato de registro:*\n` +
    `*${usedPrefix + command} [nombre].[edad]*\n\n` +
    `*💡 Ejemplo:*\n` +
    `*${usedPrefix + command} DEPOOL-SENSEI.18*`)
  
  let [_, name, splitter, age] = text.match(Reg)
  
  if (!name) return conn.reply(m.chat, '❌ El nombre del Sensei no puede estar vacío.', m)
  if (!age) return conn.reply(m.chat, '❌ La edad del Sensei no puede estar vacía.', m)
  
  age = parseInt(age)
  if (age < 13) return conn.reply(m.chat, '❌ Debes tener al menos 13 años para registrarte en Kivotos Academy.', m)
  
  user.name = name.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true
  
  let sn = createHash('md5').update(m.sender).digest('hex')
  let img = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.pinimg.com/736x/eb/a4/fb/eba4fbad60730bc11bbabef0966a69b2.jpg')
  
  let now = new Date()
  let date = now.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  let time = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
  
  let studentId = `${age}${sn.slice(0, 4).toUpperCase()}`
  
  let txt = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`
  txt += `┃    🎓 KIVOTOS ACADEMY 🎓       ┃\n`
  txt += `┃ REGISTRO DE SENSEI COMPLETADO   ┃\n`
  txt += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`
  
  txt += `╔═════════════════════════════════╗\n`
  txt += `║ 📋 DATOS DEL SENSEI 📋                               ║\n`
  txt += `╠═════════════════════════════════╣\n`
  txt += `║  👤 Sensei: @${m.sender.split('@')[0]}\n`
  txt += `║  📝 Nombre: ${name}\n`
  txt += `║  🎂 Edad: ${age} años\n`
  txt += `║  🆔 ID Estudiante: ${studentId}\n`
  txt += `║  📅 Fecha de Registro: ${date}\n`
  txt += `║  ⏰ Hora de Registro: ${time}\n`
  txt += `║  🔐 Código de Verificación: ${sn.slice(0, 8).toUpperCase()}\n`
  txt += `╚═══════════════════════════════════════════════════════════════
