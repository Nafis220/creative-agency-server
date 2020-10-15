var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
const fileUpload = require('express-fileupload');
var gi = require(`gitignore`);
require('dotenv').config()
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('services'));
app.use(fileUpload());

app.get('/', function (req, res) {
  res.send('hello world')
})



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}.hybz5.mongodb.net/creative_agency?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const orderCollection = client.db("creative_agency").collection("orders");
  const reviewCollection = client.db("creative_agency").collection("review");
  const serviceCollection = client.db("creative_agency").collection("services");
  const adminCollection = client.db("creative_agency").collection("admin");
  app.post('/addOrder',(req,res)=>{
    const order = req.body
    orderCollection.insertOne(order)
    .then(result=>{
      res.send(result)
    })
  })
  
app.post('/review',(req,res)=>{
  const review = req.body ;
  reviewCollection.insertOne(review)
  .then(result=>{
    res.send(result)
  })
})

app.post('/addServices', (req, res) => {
  
  const file = req.files.file;
  const name = req.body.name;
  const description = req.body.description;

file.mv(`${__dirname}/services/${file.name}`,err => {
  if(err){
    console.log(err)
    res.status(500).send({msg:'Failed to upload Image'});
  }
 return res.send({name:file.name, path:`${file.name}`})
})
serviceCollection.insertOne({name,description,img:file.name})


})

app.post('/addAdmin',  (req, res) => {
  const admin = req.body.admin
  
  adminCollection.insertOne(admin)
})

app.post('/isAdmin',  (req, res) => {
  const email = req.body.email
   adminCollection.find({email:email})
   .toArray((err,documents)=>{
     res.send(documents.length > 0)
   })
})

app.post('/review', (req, res)=>{

})


app.get('/allServices',(req,res) =>{
  serviceCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})



app.get('/allOrders',(req,res)=>{
    
  orderCollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })
})


  app.get('/selectedOrders',(req,res)=>{
    
    orderCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/givenReview',(req,res)=>{
    
    reviewCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

});





app.listen(process.env.PORT || port)
