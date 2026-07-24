import mongoose from "mongoose"

type ConnectionObject = {
    isConnect?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> { 
    if (connection.isConnect) {
        console.log("DB Already connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")

        connection.isConnect = db.connections[0].readyState

        console.log("DB Connected")
    } catch (error) {
        console.error("DB Connection failed", error)
        process.exit(1)
    }
}

export default dbConnect