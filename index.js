var express = require('express')
var bodyParser = require('body-parser')
var fast2sms = require('fast-two-sms')
require('dotenv').config();
var mongoose = require('mongoose')
var multer  = require('multer')
var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });
var upload = multer({ storage:storage })
const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://Localhost:27017/Regis',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error',()=>console.log("Error in connecting to Mongo"));
db.once('open',()=>console.log("Connected to database"));
var otp = Math.floor(1000 + Math.random() * 9000);
app.post("/signup", upload.single('avatar') ,async(req, res, cb) => {
    // console.log(req.file);
    console.log(req.body.number);
   

    var firstName = req.body.first;
    var lastName = req.body.last;
    var username = req.body.username;
    var password = req.body.password;
    var number = req.body.number;
    
 
 
 
     data = {
        "firstname": firstName,
        "lastname": lastName,
        "username": username,
        "password": password,
        "number": number
     }
    
console.log(otp);
     const  response = await fast2sms.sendMessage({authorization:process.env.API_KEY, message : otp, numbers : [req.body.number]});
     console.log(response);
   return res.redirect("otp.html");
   
    
});
app.post('/otpind',(req, res) => {
    var otpen = req.body.otpin;
    
    console.log(otpen,otp)
    if(otpen==otp) {
        console.log(data);
       db.collection('Users').insertOne(data,(err,collection)=>{
           if(err) {
               throw err;
           }
           console.log("Record inserted successfully");
       });
       return res.redirect('finish.html')
   }
   else {
      console.log("try again");
       res.redirect('regis.html');
   }
})

app.get('/regis',(req, res)=>{
console.log("Going to regis page");
res.redirect('regis.html');
});
app.get('/login',(req, res)=>{
    console.log("Going to login page");
    res.redirect('login.html');
    });
    app.get('/logind',(req, res)=>{
        console.log("Going to logind page");
    res.redirect('dash.html');
        });
      
    

app.get("/",(req,res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('login.html')
}).listen(3000);

console.log("listening");