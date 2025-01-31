// Ubicación: lib/database-manager.js
import fs from 'fs'
import path from 'path'

class DatabaseManager {
    constructor() {
        this.dbPath = './database'
        this.waifuPath = path.join(this.dbPath, 'waifu_data.json')
        this.loadInterval = 5 * 60 * 1000 // 5 minutos
        this.init()
    }

    init() {
        // Crear directorio si no existe
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true })
        }
        
        // Cargar datos iniciales
        this.loadData()
        
        // Configurar autoguardado
        setInterval(() => this.saveData(), this.loadInterval)
    }

    loadData() {
        try {
            if (fs.existsSync(this.waifuPath)) {
                const data = fs.readFileSync(this.waifuPath, 'utf-8')
                const parsedData = JSON.parse(data)
                
                // Inicializar la base de datos global
                if (!global.db) global.db = {}
                if (!global.db.waifu) global.db.waifu = {}
                
                // Cargar colecciones
                global.db.waifu.collection = parsedData.collection || {}
                global.db.waifu.waifus = parsedData.waifus || {}
                
                console.log('✅ Base de datos de waifus cargada correctamente')
            } else {
                // Inicializar estructura básica
                if (!global.db) global.db = {}
                if (!global.db.waifu) {
                    global.db.waifu = {
                        collection: {},
                        waifus: {}
                    }
                }
                this.saveData()
            }
        } catch (error) {
            console.error('❌ Error al cargar la base de datos:', error)
            // Inicializar estructura básica en caso de error
            if (!global.db) global.db = {}
            if (!global.db.waifu) {
                global.db.waifu = {
                    collection: {},
                    waifus: {}
                }
            }
        }
    }

    saveData() {
        try {
            const data = {
                collection: global.db.waifu.collection || {},
                waifus: global.db.waifu.waifus || {}
            }
            
            fs.writeFileSync(this.waifuPath, JSON.stringify(data, null, 2))
            console.log('💾 Base de datos de waifus guardada correctamente')
        } catch (error) {
            console.error('❌ Error al guardar la base de datos:', error)
        }
    }
}

// Exportar una instancia única
const databaseManager = new DatabaseManager()
export default databaseManager
