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

    const collection2 = db.collection('textiles');

    const initialData2 = [
        {Name: "Cotton", Image: "cotton.png", Washing: "Turn clothes inside out, wash in cold water on a gentle or normal cycle with similar color clothes", Drying: "Air drying, or dryer with low heat or permanent press setting", Storing: "Avoid storing in airless areas like basements and attics", StainRemoval: "Blot stains before they spread, apply a stain-removing treatment and wash", Ironing: "Iron them daily as they wrinkle easily", Detergent: "Avoid using fabric softener or detergents with softener additives"},
        {Name: "Nylon", Image: "nylon.jpg", Washing: "Use cold or lukewarm water on a gentle cycle; hand washing is also recommended for delicate items", Drying: "Air-dry or use a low-heat setting in the dryer to avoid shrinking or damaging the fibers", Storing: "Store in a cool, dry place away from direct sunlight to prevent discoloration", StainRemoval: "Use a mild detergent and gently rub the stain; avoid harsh scrubbing to prevent fabric damage", Ironing: "Use a low-heat setting with a pressing cloth to avoid melting the synthetic fibers", Detergent: "Use a mild detergent and avoid fabric softeners, as they can coat the fibers and reduce breathability"},
        {Name: "Linen", Image: "linen.jpg", Washing: "Wash in cold or lukewarm water on a gentle cycle; hand washing is ideal for preserving the fabric", Drying: "Air-dry flat or tumble dry on low heat to prevent shrinking or wrinkling excessively", Storing: "Store in a cool, dry place; fold rather than hang to avoid stretching the fibers", StainRemoval: "Treat stains immediately with a mild detergent or stain remover; avoid bleach, which can weaken the fibers", Ironing: "Use a high-heat setting with steam while the fabric is slightly damp for the best results", Detergent: "Use a mild detergent; fabric softener is optional but can help reduce stiffness"},
        {Name: "Leather", Image: "leather.jpg", Washing: "Avoid machine washing; instead, clean with a damp cloth and mild soap for surface dirt or use a leather cleaner for thorough cleaning", Drying: "Air-dry naturally, away from direct sunlight or heat sources to prevent cracking or shrinking", Storing: "Store in a cool, dry place; hang on padded hangers to maintain shape and avoid creases", StainRemoval: "Use a damp cloth for minor stains; for tougher stains, consult a professional leather cleaner", Ironing: "Avoid ironing; if necessary, use a low-heat setting with a pressing cloth and minimal pressure", Detergent: "Do not use fabric softeners or regular detergents; stick to products specifically designed for leather care"},
        {Name: "Silk", Image: "silk.jpg", Washing: "Hand wash in cold water with a mild detergent or use a delicate cycle on the washing machine inside a mesh bag. Avoid harsh scrubbing", Drying: "Air-dry by laying flat on a clean towel; avoid direct sunlight or tumble drying to prevent fabric damage", Storing: "Store in a cool, dry place; fold neatly and wrap in tissue paper to prevent creases. Keep away from direct light to avoid discoloration", StainRemoval: "Blot stains gently with a damp cloth and a mild detergent; avoid vigorous rubbing. For stubborn stains, consult a professional cleaner", Ironing: "Use a low-heat setting and iron on the reverse side while the fabric is slightly damp. Use a pressing cloth for added protection", Detergent: "Use a mild detergent specifically for delicate fabrics; avoid fabric softeners to preserve the natural sheen of silk"},
        {Name: "Wool", Image: "wool.jpg", Washing: "Hand wash in cold or lukewarm water with a wool-specific detergent, or use the gentle cycle on the washing machine. Avoid hot water to prevent shrinking", Drying: "Lay flat on a clean towel to air-dry; reshape while damp and avoid hanging, as it can stretch the fibers", Storing: "Store in a cool, dry place; fold rather than hang to prevent stretching. Use moth repellents like cedar blocks or lavender sachets", StainRemoval: "Blot stains immediately with a damp cloth and a mild detergent; avoid rubbing to prevent felting", Ironing: "Use a low to medium heat setting with steam and a pressing cloth to prevent scorching or shine", Detergent: "Use a wool-specific detergent; avoid fabric softeners as they can coat and weigh down the fibers"},
        {Name: "Velvet", Image: "velvet.jpg", Washing: "Hand wash in cold water with a mild detergent or dry clean if the label recommends it. Machine washing is not ideal for velvet", Drying: "Air-dry flat on a clean towel; avoid wringing or hanging to prevent distortion of the pile", Storing: "Store in a cool, dry place; hang on padded hangers to maintain shape and avoid crushing the fabric", StainRemoval: "Gently blot stains with a damp cloth and mild detergent; do not rub, as it can damage the pile. Seek professional cleaning for stubborn stains", Ironing: "Avoid ironing directly; use a steamer or iron on the reverse side with a pressing cloth on low heat to protect the fabric's texture", Detergent: "Use a mild detergent suitable for delicate fabrics; avoid fabric softeners as they can alter the fabric's texture"},
        {Name: "Denim", Image: "denim.jpeg", Washing: "Wash infrequently, ideally after 5-10 wears, in cold water on a gentle cycle. Turn inside out to prevent fading and friction", Drying: "Air-dry flat or hang to dry in a shaded area to avoid shrinking and maintain shape. Avoid tumble drying", Storing: "Fold denim to avoid stretching. Store in a cool, dry place away from direct sunlight to preserve color", StainRemoval: "Spot-clean stains immediately with a mild detergent or stain remover. Avoid using bleach to prevent color damage", Ironing: "Use a medium-heat setting with steam. Iron inside out to avoid shiny marks on the surface.", Detergent: "Use a mild detergent. Avoid fabric softeners to maintain the denim's natural texture"},
    ]

    try {
        const result = await collection.insertMany(initialData);
        console.log(`${result.insertedCount} documents inserted into 'piece' collection.`);

        const result2 = await collection2.insertMany(initialData2);
        console.log(`${result2.insertedCount} documents inserted into 'textiles' collection.`);

        const fashionpieces = await collection.find().toArray();
        console.log('Fashion pieces:', fashionpieces);
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        await closeConnection();
    }
}

initializeDatabase().catch(console.error);
