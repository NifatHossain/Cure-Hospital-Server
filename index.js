const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


//mondodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtdunhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const database = client.db("cure-hospital");
    const treatmentCollection = database.collection("allTreatments");
    const appointmentCollection= database.collection("appointmentCollection")
    app.post('/addtreatments',async(req,res)=>{
        const treatment= req.body
        console.log(treatment)
        const result = await treatmentCollection.insertOne(treatment);
        res.send(result)
    })
    app.get('/alltreatments', async(req,res)=>{
        const cursor = treatmentCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })
    app.get('/carddetails/:id', async(req,res)=>{
        const newId= req.params.id;
        const query = { _id: new ObjectId(newId) };
        const result= await treatmentCollection.findOne(query);
        res.send(result)
    })
    app.post('/addappointment',async(req,res)=>{
        const apponitment= req.body
        console.log(apponitment)
        const result = await appointmentCollection.insertOne(apponitment);
        res.send(result)
    })
    app.get('/alltreatments/:email', async(req,res)=>{
        const receivedEmail=  req.params.email;
        const query= {secviceAdderEmail: receivedEmail};
        const cursor= treatmentCollection.find(query);
        const result= await cursor.toArray()
        res.send(result);

    })
    app.get('/bookedappointments/:email', async(req,res)=>{
        const receivedEmail=  req.params.email;
        const query= {patientEmail: receivedEmail};
        const cursor= appointmentCollection.find(query);
        const result= await cursor.toArray()
        res.send(result);

    })
    app.patch('/updatetreatment/:id', async(req,res)=>{
        const receivedId= req.params.id
        const filter = { _id:new ObjectId(receivedId) };
        const updateDoc = {
            $set: {
                doctorName:req.body.doctorName,
                image :req.body.image, 
                degrees :req.body.degrees,
                department :req.body.department, 
                dept_Img :req.body.dept_Img, 
                location :req.body.location, 
                fee :req.body.fee, 
                serviceAdderName :req.body.serviceAdderName, 
                serviceAdderImage :req.body.serviceAdderImage
            },
          };
          const result = await treatmentCollection.updateOne(filter, updateDoc);
          res.send(result);

    })
    app.delete('/deletetreatment/:id',async(req,res)=>{
        const gotId= req.params.id;
        const query = { _id: new ObjectId(gotId) };
        const result = await treatmentCollection.deleteOne(query);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})