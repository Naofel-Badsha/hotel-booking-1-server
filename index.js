
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//------middleWare-------
//---{origin: [],credentials: true}
// {
//   origin: [
//     'http://localhost:5174', 'http://localhost:5173'
//   ],
//   credentials: true
// }
app.use(cors());
app.use(express.json());
// app.use(cookieParser);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8tunxxp.mongodb.net/?retryWrites=true&w=majority`;

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


    const roomCollection = client.db('hotelRoom').collection('rooms');
    const bookingCollection = client.db('hotelRoom').collection('booking');
   

   //---------------------------------------------
    //-----authentication---reladed----API----
    //--------user---login---cookise-------
    // app.post('/jwt', async(req, res) =>{
    //   const user = req.body;
    //   console.log('user for token', user);
    //   const token =jwt.sign(user, process.env.ASSESS_TOKEN_SECRET, {expiresIn: '1h'})
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'none'
    //   })
    //   .send({success: true});
    // });
   
    //-------//--------user---loginOut---cookise-------
    // app.post('/logout', async(req, res) =>{
    //   const user = req.body;
    //   console.log('logging out', user)
    //   res.clearCookie('token', {maxAge: 0}).send({success: true});
    // });
  //---------------------------------------------

    //--------inserted------all---data--by-----database-----
    app.get('/rooms', async(req, res) =>{
     const cursor = roomCollection.find();
     const result = await cursor.toArray();
     res.send(result);
    })

    //-------roomdetail-----id--------
    app.get('/rooms/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await roomCollection.findOne(query);
      res.send(result)
    });

    //------booking--card----post------
    app.post('/booking', async(req, res) => {
      const er = req.body;
      console.log(er)
      const result = await bookingCollection.insertOne(er);
      res.send(result)
        
    })
    //------booking--card----get------by----database-----
    app.get('/booking', async(req, res)=>{
      const cursor = bookingCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    //---------booking---card------delete----
    app.delete('/booking/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    ///await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('hotel booking....!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})