import { MongoClient, ServerApiVersion } from 'mongodb';

// Replace with your MongoDB URI
const uri = "mongodb+srv://aaronberkson:EVQAV5rMRKcQbyak%40clusterone.amlfjbi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function fetchData(collectionName, query = {}) {
  try {
    await client.connect();
    const database = client.db('badbank');  // Ensure 'badbank' is your actual database name
    const collection = database.collection(collectionName);
    const data = await collection.find(query).toArray();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  } finally {
    await client.close();
  }
}

export default fetchData;
