const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;
// middleware
app.use(cors());
app.use(express.json());


const uri =
  "mongodb+srv://faraazhossainimran:4goqUUPoDFCzdj7R@cluster0.mko9qjp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("userDB").collection("users")
    // post single Data endpoint
    app.post('/users', async(req, res) => {
    const user = req.body;
    const result = await userCollection.insertOne(user)
    console.log(result);
    res.send(result)
    })
    // Delete User
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id
        console.log(id);
        const query = {
            _id: new ObjectId(id)
        }
        const result = await userCollection.deleteOne(query)
        res.send(result)
    }) 
    // Get user from frontend
    app.get('/users', async(req, res) => {
        const result =  await userCollection.find().toArray();
        console.log(result);
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("hi");
  res.send("crud is running ....");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
