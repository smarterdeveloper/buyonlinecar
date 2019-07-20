// get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
    
const app = express();

// parse requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(fileUpload());

// default route
app.get('/', (req, res) => {
    res.json("WELCOME BUYANYCARONLINE");
});

// listen on port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

app.use(express.static('public'))

var admin = require("firebase-admin");

var serviceAccount = require("./anycaronline.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anycaronline-8bf60.firebaseio.com"
});

require('./app/user/user.routes')(app);
require('./app/billinginfo/billinginfo.routes')(app);
require('./app/ad/ad.routes')(app);
require('./app/vehicle/vehicle.routes')(app);
require('./app/car/car.routes')(app);
require('./app/make/make.routes')(app);
require('./app/model/model.routes')(app);
