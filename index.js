const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app= express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//syed88783
//dtsrf1w27p3kt83T



const uri = "mongodb+srv://syed88783:dtsrf1w27p3kt83T@cluster0.probygd.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("userDB");
    const userCollection = database.collection("users");
    // Send a ping to confirm a successful connection

    app.get('/users',async(req,res)=>{
       const result=await userCollection.find({}).toArray();
       res.send(result);
    //    const cursor=userCollection.find();
    //    const result=await cursor.toArray();
    //    res.send(result);
    })
    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const result=await userCollection.findOne({_id: new ObjectId(id)});
        res.send(result);
    });
    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const result=await userCollection.deleteOne({_id: new ObjectId(id)});
        res.send(result)
    });
    app.put('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const user=req.body;
        console.log(user);
        const filter={_id: new ObjectId(id)};
        const options={upsert: true};
        const updatedUser={
            $set:{
                name:user.name,
                email:user.email,
                            
            }
        }
        const result = await userCollection.updateOne(filter, updatedUser, options);
        res.send(result);
    });
    app.post('/users',async(req,res) => {
        const user=req.body;
        console.log('new user',user);
        const result=await userCollection.insertOne(user)
        res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.log);


app.get('/',(req,res)=>{
    res.send('SIMPLE CRUD SERVER RUNNING');
})

app.listen(port,()=>{
    console.log(`Listening on ${port}`)
});