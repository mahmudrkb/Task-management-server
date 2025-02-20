const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kw4xi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

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

    const taskCollections = client.db("taskDB").collection("tasks");

    app.post("/add-task", async (req, res) => {
        const task = req.body;
      
        const result = await taskCollections.insertOne(task);
        res.send(result);
      });

      app.get("/show-task/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email : email };
        const result = await taskCollections.find(query).toArray();
        res.send(result);
      });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task management server is running..........");
});

app.listen(port, () => {
  console.log(` app is running  on port ${port}`);
});
