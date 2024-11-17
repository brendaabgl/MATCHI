// const { connectToDatabase, closeConnection } = require('./app');

const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function connectToDatabase(dbName) {
    try {
        await client.connect(); 
        console.log(`Connected to MongoDB, Database: ${dbName}`);
        return client.db(dbName);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

async function closeConnection() {
    await client.close();
    console.log("Connection to MongoDB closed.");
}


async function initializeDatabase() {
    const dbName = 'MATCHI'; 
    const db = await connectToDatabase(dbName); 

    const collection = db.collection('pieces');

    const initialData = [
        {Name: "Emily Top", NameId: "EmilyTop", Description: "Sleeveless tube top with the color selection of pink, green, and blue. With subtle floral pattern", Image: "emilytop.jpeg", Color: ["pink", "green", "blue"], Tags: ["spring", "casual", "y2k", "coquette"], Material: "Cotton"},
        {Name: "Racer Baby Tee", NameId: "RacerBabyTee", Description: "A racer themed body-fitted mini t-shirt", Image: "racerbtee.jpeg", Color: ["black", "grey"], Tags: ["streetwear", "casual", "acubi", "t-shirt"], Material: "Nylon"},
        {Name: "Oversized Snoopy Hoodie", NameId: "OversizedSnoopyHoodie", Description: "Oversized thick snoopy hoodie that is very comfortable", Image: "snoopyhoodie.jpeg", Color: ["brown", "green"], Tags: ["comfortable", "casual", "homewear"], Material: "Synthetic"},
    ];

    try {
        const result = await collection.insertMany(initialData);
        console.log(`${result.insertedCount} documents inserted into 'tryout' collection.`);

        const fashionpieces = await collection.find().toArray();
        console.log('Fashion pieces:', fashionpieces);
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        await closeConnection();
    }
}

initializeDatabase().catch(console.error);
