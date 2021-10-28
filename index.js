const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors');


const port = process.env.PORT || 5000;
const app = express()
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qp7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('donation_db');
      const donationCollection = database.collection('collection');
        //find or load all in 5000
        app.get('/donations',async (req,res)=>{
            const cursor = donationCollection.find({});
            const donations = await cursor.toArray();
            res.send(donations);
        })
      //post api
      app.post('/donations',async (req,res)=>{
          const donation = req.body;
        //   console.log("hit the post",donation);
          const result = await donationCollection.insertOne(donation);
        //   console.log(result);
          res.json(result);
      })

      //single api
      app.get('/donations/:id',async (req,res)=>{
        const id = req.params.id;
        // console.log(id);
        const query = {_id: ObjectId(id)};
        const result  = await donationCollection.findOne(query);
        res.json(result);
      })



      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})