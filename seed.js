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
        {Name: "Emily Top", NameId: "EmilyTop", Description: "Sleeveless tube top with the color selection of pink, green, and blue. With subtle floral pattern", Image: "emilytop.jpeg", Color: ["pink", "green", "blue"], Tags: ["summer", "top"], Material: "Cotton"},
        {Name: "Racer Baby Tee", NameId: "RacerBabyTee", Description: "A racer themed body-fitted mini t-shirt", Image: "racerbtee.jpeg", Color: ["black", "grey"], Tags: ["summer", "top"], Material: "Nylon"},
        {Name: "Oversized Snoopy Hoodie", NameId: "OversizedSnoopyHoodie", Description: "Oversized thick snoopy hoodie that is very comfortable", Image: "snoopyhoodie.jpeg", Color: ["brown", "green"], Tags: ["winter", "top"], Material: "Linen"},
        {Name: "Cozy Grandpa Sweater", NameId: "CozyGrandpaSweater", Description: "Super cozy fall sweater to use while reading book and sipping pumpkin spice latte", Image: "cozyfallsweater.jpg", Color: ["brown", "green", "blue"], Tags: ["autumn", "top"], Material: "Wool"},
        {Name: "Floral Long Skirt", NameId: "FloralLongSkirt", Description: "A comfortable and breezy long floral skirt that will definitely hype your gram", Image: "floralskirt.jpg", Color: ["pink", "green"], Tags: ["bottom", "spring"], Material: "Silk"},
        {Name: "Floral Spring Dress", NameId: "FloralSpringDress", Description: "Floral spring dress with cute puffy sleeve that is perfect to go through flower gardens", Image: "floralspringdress.jpg", Color: ["pink", "purple"], Tags: ["one-piece", "spring"], Material: "Silk"},
        {Name: "Floral Sundress", NameId: "FloralSunDress", Description: "The iconic sundress that will make all eyes double take", Image: "floralsundress.jpg", Color: ["blue", "pink", "red"], Tags: ["spring", "one-piece"], Material: "Silk"},
        {Name: "Green Flip Flops", NameId: "GreenFlipFlops", Description: "A thick flip flops like wearing a cloud", Image: "greenflipflops.jpg", Color: ["pink", "green"], Tags: ["footwear", "summer"], Material: "Leather"},
        {Name: "Linen Summer Shorts", NameId: "LinenSummerShorts", Description: "The most comfortable summer shorts you will ever find", Image: "linensummershorts.jpg", Color: ["brown", "green"], Tags: ["bottom", "summer"], Material: "Cotton"},
        {Name: "Popham Puffer Jacket", NameId: "PophamPufferJacket", Description: "A puffer jacket like being hugged by barney", Image: "pophampufferjacket.jpeg", Color: ["blue", "red", "grey"], Tags: ["winter", "top"], Material: "Nylon"},
        {Name: "Puffer Jacket", NameId: "Puffer Jacket", Description: "Don't worry, you look cute drowned in all that comfy puffiness", Image: "pufferjacket.jpg", Color: ["black", "grey"], Tags: ["winter", "top"], Material: "Nylon"},
        {Name: "Summer Knit Tank Top", NameId: "SummerKnitTankTop", Description: "The cutest tank top to wear while drenching in sweat waiting for your iced tea order", Image: "summerknitwear.jpg", Color: ["cream", "brown", "pink"], Tags: ["summer", "top"], Material: "Wool"},
        {Name: "Thermal Pants", NameId: "ThermalPants", Description: "Magic pants that keeps you warm while the whole world is freezing", Image: "thermalpants.jpg", Color: ["black"], Tags: ["bottom", "winter"], Material: "Nylon"},
        {Name: "Trench Coat", NameId: "TrenchCoat", Description: "Must have clothing items for autumn that looks extra classy", Image: "trenchcoat.jpg", Color: ["cream", "brown"], Tags: ["top", "autumn"], Material: "Velvet"},
        {Name: "Winter Scarf", NameId: "WinterScarf", Description: "Careful! Don't want to freeze your head off!", Image: "winterscarf.jpg", Color: ["yellow", "purple", "pink", "white", "black"], Tags: ["winter", "top"], Material: "Cotton"},
        {Name: "Dark Wash Jeans", NameId: "DarkWashJeans", Description: "You don't have this yet? Shame on you, shame on you", Image: "darkwashjeans.jpg", Color: ["blue"], Tags: ["bottom", "autumn"], Material: "Denim"},
        {Name: "Woman Uggs", NameId: "WomanUggs", Description: "It said woman uggs, but gentleman, you can wear it if you will", Image: "womanuggs.png", Color: ["brown", "black"], Tags: ["footwear", "autumn"], Material: "Velvet"},
        {Name: "Tennis Skirt", NameId: "Tennis Skirt", Description: "Let's be honest, you don't wear it to play tennis do you?", Image: "tennisskirt.jpg", Color: ["white", "pink"], Tags: ["bottom", "summer"], Material: "Cotton"},
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
