const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5174',"http://localhost:5173", "http://localhost:5175", "https://artcraft-c8559.web.app", "https://artcraft-c8559.firebaseapp.com"]
}));
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
    // await client.connect();

    const database = client.db('art&craft');
    const artCollection = database.collection('arts&Crafts');
    const categoryCollection = database.collection('subCategories');

    app.post('/crafts', async (req, res) => {
      const artsData = req.body;
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

    app.get('/crafts/email/:email', async (req, res) => {
      const email = req.params.email;
      const query = { Email: email }
      const cursor = artCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artCollection.deleteOne(query);
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

    app.get('/subCategory', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/subCategory/:sub_category', async (req, res) => {
      const sub_category = req.params.sub_category;
      const query = { sub_category: sub_category }
      const result = await categoryCollection.findOne(query)
      res.send(result);
    })

    app.get('/crafts/sub_category/:sub_category', async (req, res) => {
      const sub_category = req.params.sub_category;
      const query = { subcategory_Name: sub_category }
      const cursor = artCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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