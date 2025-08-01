import chalk from 'chalk'
import cfonts from 'cfonts'

export function displayBanner() {
  console.clear()
  
  // ASCII Art Banner
  console.log(chalk.cyan(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                                      ┃
┃                          ██████╗ ██╗     ██╗   ██╗███████╗                                          ┃
┃                          ██╔══██╗██║     ██║   ██║██╔════╝                                          ┃
┃                          ██████╔╝██║     ██║   ██║█████╗                                            ┃
┃                          ██╔══██╗██║     ██║   ██║██╔══╝                                            ┃
┃                          ██████╔╝███████╗╚██████╔╝███████╗                                          ┃
┃                          ╚═════╝ ╚══════╝ ╚═════╝ ╚══════╝                                          ┃
┃                                                                                                      ┃
┃              █████╗ ██████╗  ██████╗██╗  ██╗██╗██╗   ██╗███████╗                                   ┃
┃             ██╔══██╗██╔══██╗██╔════╝██║  ██║██║██║   ██║██╔════╝                                   ┃
┃             ███████║██████╔╝██║     ███████║██║██║   ██║█████╗                                     ┃
┃             ██╔══██║██╔══██╗██║     ██╔══██║██║╚██╗ ██╔╝██╔══╝                                     ┃
┃             ██║  ██║██║  ██║╚██████╗██║  ██║██║ ╚████╔╝ ███████╗                                   ┃
┃             ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝                                   ┃
┃                                                                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `))
  
  console.log(chalk.magenta.bold(`
                              🌸💙 KIVOTOS ACADEMY SYSTEM 💙🌸
                           🎯 Tachibana Nozomi Multi-Device Bot 🎯
  `))
  
  console.log(chalk.blue(`
  ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                    MILLENNIUM SCIENCE SCHOOL                                         ║
  ║                                     CLUB DE INGENIERÍA                                               ║
  ║                                   Presidenta: Tachibana Nozomi                                       ║
  ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝
  `))
  
  console.log(chalk.yellow(`
  🌸 Sistema de IA: ${chalk.green('ACTIVADO')}
  💙 Multi-Dispositivo: ${chalk.green('CONECTADO')}
  🎯 Base de Datos: ${chalk.green('SINCRONIZADA')}
  ✨ Comandos: ${chalk.green('CARGADOS')}
  🏫 Academia: ${chalk.cyan('KIVOTOS OPERATIVO')}
  `))
  
  console.log(chalk.cyan(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃                            🌟 "¡Hagamos de Kivotos un lugar mejor!" 🌟                            ┃
  ┃                                    - Tachibana Nozomi                                              ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `))
  
  console.log(chalk.green.bold(`\n                                    ✨ SISTEMA INICIADO ✨\n`))
}

export function systemInfo() {
  console.log(chalk.blue(`
  ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                   INFORMACIÓN DEL SISTEMA                                            ║
  ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════╣
  ║ 🤖 Bot: Tachibana Nozomi System v3.0                                                                ║
  ║ 🏫 Academia: Millennium Science School                                                              ║
  ║ 🎯 Club: Club de Ingeniería                                                                         ║
  ║ 💙 Desarrollador: (ㅎㅊDEPOOLㅊㅎ)                                                                     ║
  ║ 🌸 Estado: Completamente Operativo                                                                  ║
  ║ ⚡ Tecnología: WhatsApp Multi-Device                                                                ║
  ║ 🛡️ Seguridad: Protocolos de Kivotos                                                                ║
  ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════╝
  `))
}

export default { displayBanner, systemInfo }
