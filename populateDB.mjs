import mongoose from 'mongoose';
import admin from 'firebase-admin';
import User from './models/userModel.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./fir-ab-bad-bank-firebase-adminsdk-ooa6f-8d49c7790c.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

mongoose.connect('mongodb+srv://aaronberkson:EVQAV5rMRKcQbyak@clusterone.amlfjbi.mongodb.net/badbank?retryWrites=true&w=majority&appName=ClusterOne');

const users = [
  {
    UUID: "93684c70-0798-45d3-84b4-5b5681cec3b9",
    profilepic: "profilepic_93684c70-0798-45d3-84b4-5b5681cec3b9.webp",
    name: "Charles ‘Pretty Boy’ Floyd",
    email: "pretty.boy@dillinger-gang.com",
    username: "prettyboy30",
    password: "DapperBandit1934",
    balance: 234092
  },
  {
    UUID: "5a459730-1234-4567-89ab-cdef12345678",
    profilepic: "profilepic_5a459730-1234-4567-89ab-cdef12345678.webp",
    name: "Vincent ‘Mad Dog’ Coll",
    email: "mad.dog@gophers-gang.com",
    username: "maddog50",
    password: "VinnysVendetta1932",
    balance: 870290
  },
  {
    UUID: "7c9e5760-a40f-467c-8b3c-0115b949a5d6",
    profilepic: "profilepic_7c9e5760-a40f-467c-8b3c-0115b949a5d6.webp",
    name: "Joseph ‘Joe Bananas’ Bonanno",
    email: "joe.bananas@bonanno-family.com",
    username: "joebananas35",
    password: "BonannoBoss1931",
    balance: 38283422
  },
  // Admin user
  {
    UUID: "543c73e8-e33a-4fac-9267-9f966fa56fa9",
    profilepic: "N/A",
    name: "N/A",
    email: "admin@badbank.com",
    username: "admin",
    password: "StashTheCashInTheVault!",
    balance: 0
  }
];

async function populateDatabase() {
  try {
    await Promise.all(users.map(async (user) => {
      // Check if user already exists in MongoDB
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        // Register user with Firebase Authentication
        const userRecord = await admin.auth().createUser({
          email: user.email,
          password: user.password,
          displayName: user.name,
        });

        // Add user to MongoDB with Firebase UID
        const newUser = new User({
          firebaseUID: userRecord.uid,
          UUID: user.UUID,
          profilepic: user.profilepic,
          name: user.name,
          email: user.email,
          username: user.username,
          password: user.password,
          balance: user.balance
        });
        await newUser.save();

        console.log(`User ${userRecord.uid} added successfully`);
      } else {
        console.log(`User with email ${user.email} already exists in MongoDB`);

        // Check if user exists in Firebase
        try {
          await admin.auth().getUserByEmail(user.email);
          console.log(`User with email ${user.email} already exists in Firebase`);
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            // Register user with Firebase Authentication
            const userRecord = await admin.auth().createUser({
              email: user.email,
              password: user.password,
              displayName: user.name,
            });

            // Update MongoDB record with Firebase UID
            existingUser.firebaseUID = userRecord.uid;
            await existingUser.save();

            console.log(`User ${userRecord.uid} added to Firebase and updated in MongoDB`);
          } else {
            console.error('Error checking Firebase:', error);
          }
        }
      }
    }));
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding users:', error);
    mongoose.connection.close();
  }
}

populateDatabase();
