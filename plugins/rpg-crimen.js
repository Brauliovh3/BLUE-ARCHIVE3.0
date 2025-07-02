let cooldowns = {}
let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)
  
  let tiempoEspera = 5 * 60
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    m.reply(`💚 ¡Sensei! Ya has realizado una travesura recientemente~ Espera *⏱ ${tiempoRestante}* antes de tu próxima aventura para evitar que las Fuerzas de Seguridad de Kivotos te atrapen. ¡Nozomi necesita ser más cuidadosa! 🌿`)
    return
  }
  
  cooldowns[m.sender] = Date.now()
  
  let senderLimit = users[senderId].limit || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }
  let randomUserLimit = users[randomUserId].limit || 0
  let minAmount = 15
  let maxAmount = 50
  let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
  let randomOption = Math.floor(Math.random() * 3)
  
  
  const successMessages = [
    "¡Operación de infiltración completada con éxito!",
    "¡La estrategia de Nozomi funcionó perfectamente!",
    "¡Misión de reconocimiento exitosa!",
    "¡El poder del Club de Ingeniería prevalece!"
  ]
  
  const failMessages = [
    "¡Oh no! Las Fuerzas de Seguridad de Kivotos te descubrieron...",
    "¡La operación falló! Nozomi necesita mejorar sus tácticas...",
    "¡Sensei, fuiste demasiado imprudente esta vez!",
    "¡El Club de Ingeniería tendrá que replanear la estrategia!"
  ]
  
  const partialMessages = [
    "¡Misión parcialmente exitosa! Pero hubo complicaciones...",
    "¡Lograste escapar, pero no todo salió según el plan!",
    "¡La retirada táctica fue necesaria!",
    "¡Nozomi salvó la situación en el último momento!"
  ]
  
  switch (randomOption) {
    case 0:
      users[senderId].limit += amountTaken
      users[randomUserId].limit -= amountTaken
      let successMsg = successMessages[Math.floor(Math.random() * successMessages.length)]
      conn.sendMessage(m.chat, {
        text: `💚🌿 ${successMsg}\n\n¡Sensei logró obtener ${amountTaken} 🌱 Cebollines de @${randomUserId.split("@")[0]} usando las tácticas del Club de Ingeniería!\n\n*Nozomi añade +${amountTaken} 🌱 Cebollines al inventario de ${senderName}* ✨\n\n"¡Excelente trabajo, Sensei! ¡La planificación estratégica siempre da resultados!" - Nozomi 💚`,
        contextInfo: { 
          mentionedJid: [randomUserId],
        }
      }, { quoted: m })
      break
      
    case 1:
      let amountSubtracted = Math.min(Math.floor(Math.random() * (senderLimit - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].limit -= amountSubtracted
      let failMsg = failMessages[Math.floor(Math.random() * failMessages.length)]
      conn.reply(m.chat, `💚🌿 ${failMsg}\n\n*Se restaron -${amountSubtracted} 🌱 Cebollines a ${senderName} como penalización* 😔\n\n"No te preocupes, Sensei... ¡La próxima vez tendremos una mejor estrategia! El Club de Ingeniería aprende de cada fallo." - Nozomi 💚`, m)
      break
      
    case 2:
      let smallAmountTaken = Math.min(Math.floor(Math.random() * (randomUserLimit / 2 - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].limit += smallAmountTaken
      users[randomUserId].limit -= smallAmountTaken
      let partialMsg = partialMessages[Math.floor(Math.random() * partialMessages.length)]
      conn.sendMessage(m.chat, {
        text: `💚🌿 ${partialMsg}\n\n¡Solo lograste obtener ${smallAmountTaken} 🌱 Cebollines de @${randomUserId.split("@")[0]} antes de la retirada táctica!\n\n*Nozomi añade +${smallAmountTaken} 🌱 Cebollines al inventario de ${senderName}* ✨\n\n"¡No está mal para una misión de emergencia, Sensei! El Club de Ingeniería siempre encuentra una salida." - Nozomi 💚`,
        contextInfo: { 
          mentionedJid: [randomUserId],
        }
      }, { quoted: m })
      break
  }
  
  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['crimen', 'travesura']
handler.command = ['crimen', 'crime', 'travesura']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let horas = Math.floor(segundos / 3600)
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}
