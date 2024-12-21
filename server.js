import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import admin from 'firebase-admin';
import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating UUIDs
const require = createRequire(import.meta.url);
const serviceAccount = require('./fir-ab-bad-bank-firebase-adminsdk-ooa6f-8d49c7790c.json');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = "mongodb+srv://aaronberkson:EVQAV5rMRKcQbyak@clusterone.amlfjbi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// Connect to MongoDB once and reuse the connection
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('badbank'); // Ensure 'badbank' is your actual database name
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if unable to connect to MongoDB
  }
}

connectToDatabase();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// API endpoint to fetch all data from MongoDB
app.get('/api/fetchData', async (req, res) => {
  try {
    const collection = db.collection('users');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// API endpoint to fetch a user by username
app.get('/api/getUserByUsername/:username', async (req, res) => {
  try {
    const collection = db.collection('users');
    const user = await collection.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// API endpoint to create a new user
app.post('/api/create-account', async (req, res) => {
  try {
    const { profilepic, name, username, email, password } = req.body;
    const uuid = uuidv4(); // Generate a UUID

    // Create the user with Firebase Admin SDK
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Create the new user object for MongoDB
    const newUser = {
      firebaseUID: userRecord.uid,
      UUID: uuid,
      profilepic,
      name,
      username,
      email,
      password,
      balance: 100
    };

    // Save the new user to MongoDB
    const collection = db.collection('users');
    await collection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// API endpoint to update user balance
app.post('/api/update-balance', async (req, res) => {
  try {
    const { email, balance } = req.body;

    // Update the user's balance in MongoDB
    const collection = db.collection('users');
    const result = await collection.updateOne({ email: email }, { $set: { balance: balance } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Balance updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Error updating balance' });
  }
});

// API endpoint to update user balance for withdrawal
app.post('/api/update-withdrawal', async (req, res) => {
  try {
    const { email, balance } = req.body;

    // Update the user's balance in MongoDB
    const collection = db.collection('users');
    const result = await collection.updateOne({ email: email }, { $set: { balance: balance } });

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Balance updated successfully after withdrawal' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating balance after withdrawal:', error);
    res.status(500).json({ message: 'Error updating balance after withdrawal' });
  }
});

// API endpoint to fetch all users' emails and passwords (for demo purposes)
app.get('/api/users', async (req, res) => {
  try {
    const collection = db.collection('users');
    const users = await collection.find({}, { projection: { email: 1, password: 1 } }).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
