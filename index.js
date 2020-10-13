var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')


app.use(bodyParser.json())
app.use(cors())
app.get('/', function (req, res) {
  res.send('hello world')
})



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://creative-agency:jwzwnT39NzQF7KU9@cluster0.hybz5.mongodb.net/creative_agency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const orderCollection = client.db("creative_agency").collection("orders");
  
  app.post('/addOrder',(req,res)=>{
    const order = req.body
    orderCollection.insertOne(order)
    .then(result=>{
      res.send(result)
    })
  })
  
  



});





app.listen(8080)
// const pass = jwzwnT39NzQF7KU9