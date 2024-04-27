const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.dr6rgwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const database = client.db('art&craft');
    const artCollection = database.collection('arts&Crafts');

    app.post('/crafts', async (req, res) => {
      const artsData = req.body;
      console.log(artsData);
      const result = await artCollection.insertOne(artsData);
      res.send(result);
    })

    app.get('/crafts', async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.findOne(query);
      res.send(result);
    })


    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateData = req.body;
      const eachData = {
        $set: {
          photo: updateData.photo,
          item_name: updateData.item_name,
          subcategory_Name: updateData.subcategory_Name,
          description: updateData.description,
          Price: updateData.Price,
          rating: updateData.rating,
          customization: updateData.customization,
          processing_time: updateData.processing_time,
          stockStatus: updateData.stockStatus,
          Email: updateData.Email,
          Name: updateData.Name
        }
      }
      const result = await artCollection.updateOne(filter, eachData, options);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})