// 'use strict'
// //const http = require('http');
// // const fs = require('fs');//to read files
// // var port = 3000;//can be any available port for node.js server


// const express = require('express');
// //const bodyParser = require("body-parser");
// //const cors = require("cors");
// /* const morgan = require('morgan');
//  */

// const mongoose = require('mongoose');

// //Create a new Express.js 
// const app = express();

// //Set up Middleware
// app.use(express.json());
// const ObesityData = require('./model/obesitydata');

// // Connect to MongoDB database
// mongoose.connect('mongodb+srv://kazimlaos94:gVx4M2GS1mHfUe3L@cluster0.aiyokdc.mongodb.net/obesity',{

// useNewUrlParser:true,
// useUnifiedTopology:true,
// });

// // mongoose.connect(dbURI)
// //     .then((result) => app.listen(3000))
// //     .catch((err) => console.log(err));



// var corsOptions = {   origin: "http://localhost:3000" };


// //const {parse} = require('querystring');

// /* const server = http.createServer((req, res) => {     
//   console.log('request made')    
//   //set header content type
//   res.setHeader('Content-Type', 'text/html');//can text/plain

//   //showing HTML page based on URL passed
//   let path = './views/pages/'
//   console.log(req.url)
//   switch(req.url){
//     case '/':
//       path += 'index.html';
//       res.statusCode = 200;
//       break;
    
//     case '/about':
//       path += 'about.html';
//       res.statusCode = 200;
//       break;

//     case '/about-me':
//       res.statusCode= 301;
//       res.setHeader('Location', '/about')
//       break; 

//     default:
//       path += '404.html';
//       res.statusCode = 404;
//       break;

//   }
 
//   //read an html file
//   fs.readFile(path, (err, data) =>{

//   //read an html file 
//   //fs.readFile('./views/pages/index.html', (err, data) => {
//     if (err) {
//         console.log(err);
//         res.end();//close the response in case of error
//     } else {
//         //write the html file data to browser[use this option for writing multiple data items]
//         //res.write(data);

//         //finally tell the server to show response to browser by passing the html file data
//         res.end(data);
//     }
//   })    
// });

// server.listen(port, 'localhost', () => {
//   console.log('listening for requests on port 3000')
// });*/

// //listen for requests
// //app.listen(3000);

// app.use(cors(corsOptions));

// //parse requests of content-type - application/json
// app.use(bodyParser.json());

// //parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended:true}));
// app.use(express.json());


// //The connection options are not supported by this version of mongoose    
// //mongoose.connect(dbURI, {useNewUriParser: true, userUnifiedToplolgy:true})
// //    .then((result) => console.log('database connected'))
// //    .catch((err) => console.error(err));

// //register view engine
// app.set('view engine', 'ejs');//it uses the default 'views' folder

// //middleware and statyic file
// app.use(express.static('public'));
// //app.use(morgan('dev'));// option include, 'tiny', 'dev', 
// app.use(express.static(__dirname + '/public'));

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to User Authentication Application." });
// });


// app.get('/list-things', (req, res) => {
//   const blogs = [
//       { title: 'eggs', desc: 'eggs come from hen', qty: '25' },
//       { title: 'stars fish', desc: 'star fish is rare', qty: '25'},
//       { title: 'jelly fish', desc: 'Jelly fish can be poision', qty: '25'},
//   ];
//   res.render('pages/home', { title: 'Home Sales Home', blogs: blogs});//render index.ejs and pass the title value to EJS file
// });




// app.get('/add-obesity-data', (req, res) => {
//   const obesity = new ObesityData({
//     Age: 27,
//     Gender: 'Male',
//     Height: 1.78,
//     Weight: 61,
//     CALC: 'Sometimes',
//     FAVC: 'yes',
//     FCVC: 2,
//     NCP: 3,
//     SCC: 'no',
//     SMOKE: 'no',
//     CH20: 2,
//     family_history_with_overweight: 'yes',
//     FAF: 0,
//     TUE: 1,
//     CAEC: 'Sometimes',
//     MTRANS: 'Public_Transportation',
//     NObeyesdad: 'Normal_Weight'
//   });    
//   obesity.save()
//     .then((result) => {
//         res.send(result)
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// });


// app.get('/all-obesity', (req, res) => {
//   ObesityData.find()
//       .then((result) => {
//           res.send(result)
//       })
//       .catch((err) => {
//           console.log(err);
//       });
// })

// app.get('/single-obesity', (req, res) => {
//   ObesityData.findbyID('6637b801586b484e2b2d4b8d')//get ID from MongoDB and paster here
//       .then((result) => {
//           res.send(result)
//       })
//       .catch((err) => {
//           console.log(err);
//       });
// })




//  app.get('/about', (req, res) => {
//   res.render('pages/about', { title: 'About Sales Blog'});
// });
// //redirects

// app.use((req, res)=> {
//   res.status(404).render('404', { title: 'Page not found' });
// });


// //Create a route to manage the obesity data entry
// app.post('/obesity', (req, res) => {
//   const { age, gender, height, weight, calc, favc, fcvc, ncp, scc, smoke, ch2o, family_history_with_overweight, faf, tue, caec, mtrans, nobeyesdad} = req.body;
//   const obesity_data = new obesityData({age, gender, height, weight, calc, favc, fcvc, ncp, scc, smoke, ch2o, family_history_with_overweight, faf, tue, caec, mtrans, nobeyesdad});

//   obesity_data.save()
//         .then((result) => {
//           res.status(201).json(result);
//         })
        
//         .catch((err) => {
//           console.error(err);
//           res.status(500).json({error: 'Error created obesity data'});
//         });

// });

// //Creating a route to manage the deleting of an entry in obesity data
// app.delete('/obesity/:id', (req, res) => {
//   const {id} = req.params;

//   obesityData.findByIdAndDelete(id)
//         .then(() => {
//           res.sendStatus(204);
//         })
//         .catch((err) => {
//           console.error(err);
//           res.status(500).json({error: 'Error deleted obesity data'});
//         });
// });

//Listen for the requests
/* app.listen(3000);

app.get('/', (req, res) => {
  res.send('<p> home page </p>');

}); */

//npm requirements 'express'

var express = require('express');
var app = express();
app.listen(3000, ()=> {
  console.log('Server listening on 3000');
})

const mongoose = require('mongoose');
mongoose.connect('URL', () => {
  console.log('Connected to Mongo DB successfully!!');
})

//APIs for a routing mechanism
//body parser to handle HTTP POST calls
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//defining the route with express
const router = express.Router();
const User = require('../Website_Mongo10232952/model/user.js');
const bcrypt = require('bcrypt');
router.post('/user', (request, response) => {
  const user = new User ({
    firstname : request.body.firstname,
    lastname: request.body.lastname,
    username: request.body.username,
    password: request.body.password,
    email: request.body.email
  });

bcrypt.hash(user.password, 10, function(err, hash) {
  if(err){
    return next(err);
  }

user.password = hash;
user.save().then(data => {
  console.log('Successfully created a new user');
}).catch(error => {

  })  
})
}) .module.exports = router


