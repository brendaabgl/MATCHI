const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
  origin: '*', // Adjust the origin if needed
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Middleware to serve static files
app.use(express.static('public'));
app.use(express.json()); // To parse JSON request bodies

// GET route for fetching pieces
app.get('/pieces', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('pieces');
    const pieces = await piecesCollection.find({}).toArray();
    res.json(pieces);
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error);
  }
});

app.get('/textile', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('textiles');
    const pieces = await piecesCollection.find({}).toArray();
    res.json(pieces);
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error);
  }
})

app.post('/pieces', async (req, res) => {
    try {
      await client.connect(); 
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('pieces');
  
      const newPiece = req.body;
      console.log("Received new piece:", newPiece);
  
      if (!newPiece.Name || !newPiece.Description || !newPiece.Image || !newPiece.Color || !newPiece.Tags) {
        return res.status(400).send('Invalid data structure');
      }
  
      const result = await piecesCollection.insertOne(newPiece);
      res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send('Error inserting data into MongoDB');
    }
  });

  app.get('/filter', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('pieces');
  
      const tag = req.query.tag;
  
      // Build the filter query
      const filter = tag ? { Tags: tag } : {};
  
      const pieces = await piecesCollection.find(filter).toArray();
      res.json(pieces);
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  });
  
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
