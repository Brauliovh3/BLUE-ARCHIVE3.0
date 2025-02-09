import fs from 'fs'
import path from 'path'

class DatabaseManager {
    constructor() {
        // Usar __dirname para obtener la ruta absoluta
        this.dbPath = path.join(process.cwd(), 'database')
        this.waifuPath = path.join(this.dbPath, 'waifu_data.json')
        this.loadInterval = 5 * 60 * 1000 // 5 minutos
        this.init()
    }

    init() {
        try {
            // Crear directorio si no existe
            if (!fs.existsSync(this.dbPath)) {
                fs.mkdirSync(this.dbPath, { recursive: true })
                console.log(`📁 Directorio creado en: ${this.dbPath}`)
            }
            
            // Crear archivo si no existe
            if (!fs.existsSync(this.waifuPath)) {
                this.initializeEmptyDB()
                console.log(`📄 Archivo de base de datos creado en: ${this.waifuPath}`)
            }
            
            this.loadData()
            
            // Guardar cada 5 minutos Y cuando hay cambios
            setInterval(() => this.saveData(), this.loadInterval)
            
            // Guardar también cuando el bot se cierra
            process.on('SIGINT', () => {
                this.saveData()
                process.exit()
            })
            
        } catch (error) {
            console.error('❌ Error en la inicialización:', error)
        }
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.waifuPath, 'utf-8')
            const parsedData = JSON.parse(data)
            
            if (!global.db) global.db = {}
            global.db.waifu = parsedData || {}
            
            // Verificar que existan todas las estructuras necesarias
            if (!global.db.waifu.users) global.db.waifu.users = {}
            if (!global.db.waifu.collection) global.db.waifu.collection = {}
            if (!global.db.waifu.waifus) global.db.waifu.waifus = {}
            
            console.log('✅ Base de datos cargada:', this.waifuPath)
            console.log('📊 Usuarios cargados:', Object.keys(global.db.waifu.users).length)
            
        } catch (error) {
            console.error('❌ Error al cargar la base de datos:', error)
            this.initializeEmptyDB()
        }
    }

    initializeEmptyDB() {
        if (!global.db) global.db = {}
        global.db.waifu = {
            users: {},
            collection: {},
            waifus: {}
        }
        this.saveData()
    }

    saveData() {
        try {
            // Verificar que existan los datos antes de guardar
            if (!global.db?.waifu) {
                console.error('❌ Error: No hay datos para guardar')
                return
            }

            // Guardar con formato legible
            const dataToSave = JSON.stringify(global.db.waifu, null, 2)
            fs.writeFileSync(this.waifuPath, dataToSave)
            
            // Verificar que el archivo se creó correctamente
            if (fs.existsSync(this.waifuPath)) {
                const stats = fs.statSync(this.waifuPath)
                console.log(`💾 Base de datos guardada (${stats.size} bytes)`)
            }
            
        } catch (error) {
            console.error('❌ Error al guardar:', error)
        }
    }
}

const databaseManager = new DatabaseManager()

// Función para forzar guardado
global.saveDB = () => {
    console.log('🔄 Guardado manual iniciado')
    databaseManager.saveData()
}

export default databaseManager
