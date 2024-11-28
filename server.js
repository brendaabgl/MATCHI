const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;
const { ObjectId } = require('mongodb');
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

app.get('/comment', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('comment');
    const pieces = await piecesCollection.find({}).toArray();
    res.json(pieces);
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error);
  }
})

app.post('/comment', async (req, res) => {
  try {
    await client.connect(); 
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('comment');

    const newPiece = req.body;
    console.log("Received new piece:", newPiece);
    const result = await piecesCollection.insertOne(newPiece);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send('Error inserting data into MongoDB');
  }
})

app.delete('/comment', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('comment');

    const { id } = req.body;
    console.log(id);

    if (!id) {
      return res.status(400).send('No ID provided');
    }

    const result = await piecesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      console.log('Deleted comment with ID:', id);
      res.status(200).send('Comment deleted successfully.');
    } else {
      console.log('No comment found with ID:', id);
      res.status(404).send('Comment not found.');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment from MongoDB');
  }
});

app.put('/comment/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const commentCollection = database.collection('comment');

    const { id } = req.params; 
    const { comment } = req.body; 

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty.' });
    }

    const result = await commentCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      { $set: { comment } },
      { returnDocument: 'after' } 
    );

    if (!result.value) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json({
      message: 'Comment updated successfully!',
      data: result.value,
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

  app.post('/users', async (req, res) => {
    try {
      await client.connect(); 
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('users');
  
      const newPiece = req.body;
      console.log("Received new piece:", newPiece);
      const result = await piecesCollection.insertOne(newPiece);
      res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).send('Error inserting data into MongoDB');
    }
  })

  app.get('/users', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('users');
      const pieces = await piecesCollection.find({}).toArray();
      res.json(pieces);
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  })

  app.put('/users/:id', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('MATCHI');
      const usersCollection = database.collection('users');
  
      const { id } = req.params; 
      const { password } = req.body; 

      console.log(password);
  
      if (!password || password.trim() === '') {
        return res.status(400).json({ message: 'Comment cannot be empty.' });
      }
  
      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) }, 
        { $set: { password } },
        { returnDocument: 'after' } 
      );
  
      if (!result.value) {
        return res.status(404).json({ message: 'password not found.' });
      }
  
      res.json({
        message: 'password updated successfully!',
        data: result.value,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.delete('/users', async (req, res) => {
    try {
      console.log("hi");
        await client.connect();
        const database = client.db('MATCHI');
        const usersCollection = database.collection('users');
        const { id } = req.body;
        if (!id) {
            return res.status(400).send('No ID provided');
        }
        console.log(id);
    
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 1) {
            console.log('Deleted user with ID:', id);
            res.status(200).send('User deleted successfully.');
        } else {
            console.log('No user found with ID:', id);
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user from MongoDB');
    }
});

  app.get('/filter', async (req, res) => {
    try {
      await client.connect();
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('pieces');
  
      const tag = req.query.tag;
      
      const filter = tag ? { Tags: tag } : {};
  
      const pieces = await piecesCollection.find(filter).toArray();
      res.json(pieces);
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  });

  app.get('/collections', async (req, res) => {
    try {
      console.log("inside");
      await client.connect();
      const database = client.db('MATCHI');
      const piecesCollection = database.collection('collections');
      const data = await piecesCollection.find({}).toArray();
      res.json(data);
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  });

  app.delete('/collections', async (req, res) => {
    try {
      console.log("hi");
        await client.connect();
        const database = client.db('MATCHI');
        const usersCollection = database.collection('collections');
        const { id } = req.body;
        if (!id) {
            return res.status(400).send('No ID provided');
        }
        console.log(id);
    
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (result.deletedCount === 1) {
            console.log('Deleted collection with ID:', id);
            res.status(200).send('Collection deleted successfully.');
        } else {
            console.log('No collection found with ID:', id);
            res.status(404).send('Collection not found.');
        }
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).send('Error deleting collection from MongoDB');
    }
});

app.post('/collections', async (req, res) => {
  try {
    await client.connect(); 
    const database = client.db('MATCHI');
    const piecesCollection = database.collection('collections');

    const newPiece = req.body;
    console.log("Received new collections:", newPiece);
    const result = await piecesCollection.insertOne(newPiece);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Error inserting collections:", error);
    res.status(500).send('Error inserting collections into MongoDB');
  }
})

app.put('/collections/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const usersCollection = database.collection('collections');

    const { id } = req.params; 
    const { Name } = req.body; 

    console.log(Name);

    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      { $set: { Name } },
      { returnDocument: 'after' } 
    );

    if (!result.value) {
      return res.status(404).json({ message: 'collection not found.' });
    }

    res.json({
      message: 'collection updated successfully!',
      data: result.value,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/addToCollections/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('MATCHI');
    const usersCollection = database.collection('collections');

    const { id } = req.params; 
    const { addtosetitem } = req.body; 

    console.log(addtosetitem);

    if (!addtosetitem || addtosetitem.trim() === '') {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      { $addToSet: { Items: addtosetitem } }
    );

    if (!result.value) {
      return res.status(404).json({ message: 'collection not found.' });
    }

    res.json({
      message: 'collection updated successfully!',
      data: result.value,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/removeFromCollections/:id', async (req, res) => {
  try {
    console.log("removing");
    await client.connect();
    const database = client.db('MATCHI');
    const usersCollection = database.collection('collections');

    const { id } = req.params; 
    const { removeitemfromset } = req.body; 

    console.log(removeitemfromset);

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, 
      { $pull: { Items: removeitemfromset } }
    );

    if (!result.value) {
      return res.status(404).json({ message: 'collection not found.' });
    }

    res.json({
      message: 'collection updated successfully!',
      data: result.value,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
