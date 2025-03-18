let handler = async (m, { conn }) => {
  
  const fortunes = [
    "Pronto encontrarás lo que has estado buscando.",
    "Un evento inesperado cambiará tu perspectiva.",
    "La música será tu respuesta en momentos difíciles.",
    "Una amistad valiosa se fortalecerá esta semana.",
    "Es momento de tomar ese riesgo que has estado evitando.",
    "Tu creatividad te llevará a nuevas oportunidades.",
    "Alguien piensa en ti más de lo que imaginas.",
    "Las pequeñas acciones de hoy traerán grandes recompensas mañana.",
    "Un viaje corto te traerá sorpresas agradables.",
    "Tu energía positiva atraerá buenas noticias próximamente.",
    "Una conversación importante te dará claridad.",
    "Es buen momento para aprender algo nuevo.",
    "La paciencia será tu mejor aliada esta semana.",
    "Una decisión del pasado mostrará sus frutos ahora.",
    "Tu amabilidad será reconocida por alguien importante.",
    "Una oportunidad única se presentará pronto.",
    "El cambio que temes será mejor de lo esperado.",
    "Tu intuición está en lo correcto, confía en ella.",
    "Un problema difícil encontrará solución de forma inesperada.",
    "Compartir tus talentos traerá alegría a otros y a ti mismo.",
     `Si tus padres te dicen estudia y sé algo en la vida, hazlo 
     porque ellos quieren que seas lo que ellos no pudieron.`
  ];
  
  const emojis = ["🎵", "💙", "✨", "🎤", "🌟", "💫", "🎶", "🌈", "🎸", "💖"];
  
  
  const luckyNumbers = [];
  for (let i = 0; i < 3; i++) {
    luckyNumbers.push(Math.floor(Math.random() * 99) + 1);
  }
  
  
  const emotions = ["felicidad", "creatividad", "tranquilidad", "entusiasmo", "amor", "inspiración", "energía", "armonía", "fortaleza", "paz"];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
 
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  
  
  const username = m.pushName || 'amig@';
  
 
  conn.reply(m.chat, `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
│ 🥠 *GALLETA DE LA FORTUNA* 🥠
╰━━━━━━━━━━━━━━━━━━━━━━━╯

Hola ${username}! Miku ha preparado tu galleta de la fortuna...

*Tu mensaje:* 
${randomEmoji} ${fortune}

*Números de la suerte:* ${luckyNumbers.join(' - ')}

*Tu emoción del día:* ${emotion}

💙 ¡Que Miku te acompañe con su música hoy!
  `, m);
  
  
  conn.sendPresenceUpdate('recording', m.chat);
  setTimeout(() => {
    conn.sendPresenceUpdate('available', m.chat);
    
    conn.sendFile(m.chat, './media/complete.mp3', 'audio.mp3', null, m, true);
  }, 2000);
}

handler.help = ['fortuna', 'galleta', 'suerte']
handler.tags = ['fun', 'entertainment']
handler.command = /^(fortuna|galleta|suerte)$/i

export default handler
