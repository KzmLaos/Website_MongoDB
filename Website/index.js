//'use strict'
const http = require('http');
const fs = require('fs');//to read files
var port = 3000;//can be any available port for node.js server
var dbURI = 'mongodb+srv://kazim:cv2GI2l0j9VPhjtv@cluster0.7notzuc.mongodb.net/obesity'

const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');


var session = require('express-session');
var cookieParser= require('cookie-parser');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '2f78e0664e0f2d86d15e8461d9362c832f0b7582532c71b45d4138d40b60dab9dd20c62b43d6e4ff9e4953c29e8b9ad94e2b1658e45d91bf77aa6c3a19075f06';
const User = require('./model/User'); 
// /* const morgan = require('morgan');
//  */

const mongoose = require('mongoose');

// Create a new Express.js 
const app = express();

// //Set up Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
app.use(session({secret: "kazim"}));


const ObesityData = require('./model/obesitydata');

// // Connect to MongoDB database
//mongoose.connect('mongodb+srv://kazimlaos94:gVx4M2GS1mHfUe3L@cluster0.aiyokdc.mongodb.net/obesity',{
//mongoose.connect('mongodb://localhost:27017/obesity',{
// });

mongoose.connect(dbURI)
     .then((result) => app.listen(3000, ()=> {
        console.log('Server listening on 3000')}))
     .catch((err) => console.log(err));

//app.listen(3000, ()=> {
//  console.log('Server listening on 3000');
//})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));


//**************************************************

//Managing users


//Verify Authentication
const authenticateJWT = (req, res, next) => {
  //   console.log("showing request");
  //   console.log(req.headers);
  //   const token = req.headers['authorization'];

  //   console.log(token);
  //   console.log(JWT_SECRET);
  // if (token) {
  //   jwt.verify(token, JWT_SECRET, (err, user) => {
  //     if (err) {
  //       return res.sendStatus(403);
  //     }
  //     req.user = user;
  //     next();
  //   });
  // } else {
  //     console.log("Token verification failed");
  //   res.sendStatus(401);
  // }
    if(req.session.authenticated){
//	req.user = user;
	next();
    } else {
	console.log("Verification failed");
     res.sendStatus(401);
   }
};




// Route to render register page
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to render login page
app.get('/', (req, res) => {
  res.render('login');
});

// Route to render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to render search page
app.get('/search', authenticateJWT, (req, res) => {
//app.get('/search', (req, res) => {
  res.render('search');
});


// Route to render search page
app.get('/filteredSearch', authenticateJWT, (req, res) => {
//app.get('/search', (req, res) => {
  res.render('filteredSearch');
});




// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error registering user' });
  }
});



// Route to login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }
      req.session.authenticated=true;
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      //res.status(200).j({message: 'Yeah'});
      //res.send({ token: token });
      res.status(200).json({token});
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error logging in' });
  }
});





//parse requests of content-type - application/json
app.use(bodyParser.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:true}));

//register view engine
//app.set('view engine', 'ejs');//it uses the default 'views' folder


// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to User Authentication Application." });
// });




app.get('/add-obesity-data', (req, res) => {
  const obesity = new ObesityData({
    Age: 27,
    Gender: 'Male',
    Height: 1.78,
    Weight: 61,
    CALC: 'Sometimes',
    FAVC: 'yes',
    FCVC: 2,
    NCP: 3,
    SCC: 'no',
    SMOKE: 'no',
    CH20: 2,
    family_history_with_overweight: 'yes',
    FAF: 0,
    TUE: 1,
    CAEC: 'Sometimes',
    MTRANS: 'Public_Transportation',
    NObeyesdad: 'Normal_Weight'
  });    
  obesity.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/all-obesity', (req, res) => {
   ObesityData.find()
       .then((result) => {
           res.send(result)
       })
       .catch((err) => {
           console.log(err);
       });
 })

// app.get('/single-obesity', (req, res) => {
//   ObesityData.findbyID('6637b801586b484e2b2d4b8d')//get ID from MongoDB and paster here
//       .then((result) => {
//           res.send(result)
//       })
//       .catch((err) => {
//           console.log(err);
//       });
// })


// Route to get a single obesity data by ID
app.get('/single-obesity', authenticateJWT, (req, res) => {
  const id = req.query.id; // Extract the ID from query parameters

  ObesityData.findById(id) // Use the extracted ID in the findById method
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err); // Send the error as a response
    });
});

// app.get('/single-obesity/:id', (req, res) => {
//   const id = req.params.id; // Extract the ID from path parameters

//   ObesityData.findById(id) // Use the extracted ID in the findById method
// 	.then((result) => {
// 	    if (!result) {
//         return res.status(404).send({ message: 'Data not found' });
//       }
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err); // Send the error as a response
//     });
// });


app.get('/single-obesity', (req, res) => {
  const id = req.query.id; // Extract the ID from query parameters

  ObesityData.findById(id) // Use the extracted ID in the findById method
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err); // Send the error as a response
    });
});



// Route to update obesity data by ID
app.put('/update-obesity/:id', authenticateJWT, (req, res) => {
  const id = req.params.id; // Extract the ID from the request parameters
  const updateData = req.body; // Extract the update data from the request body

  // Use findByIdAndUpdate to update the document
  ObesityData.findByIdAndUpdate(id, updateData, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err); // Send the error as a response
    });
});


app.get('/filteredSearch', (req, res) => {
    console.log("filtered Search");
    // Retrieve filter parameters from query string
    const { age, gender } = req.query;

    // Construct the filter object based on provided parameters
    const filter = {};
    if (age) {
        filter.Age = age;
    }
    if (gender) {
        filter.Gender = gender;
    }

    // Query the database with the constructed filter object
    ObesityData.find(filter)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});




//***********  Add Operation

// Route to render login page
app.get('/add', (req, res) => {
  res.render('add');
});


// Register route (POST)
app.post('/add', async (req, res) => {
  const { Age, 
    Gender, 
    Height, 
    Weight, 
    CALC,
    FAVC,
    FCVC,
    NCP,
    SCC,
    SMOKE,
    CH20,
    family_history_with_overweight,
    FAF,
    TUE,
    CAEC,
    MTRANS,
    NObeyesdad } = req.body; // Destructure data
  console.log(Weight);
  console.log(CH20);
  const newData = new ObesityData({
    Age,
    Gender,
    Height,
    Weight,
    CALC,
    FAVC,
    FCVC,
    NCP,
    SCC,
    SMOKE,
    CH20,
    family_history_with_overweight,
    FAF,
    TUE,
    CAEC,
    MTRANS,
    NObeyesdad
    // Add hashed password if applicable
  });

  try {
    const savedData = await newData.save();
    res.send('Input successfully added!'); // Change this to a proper response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding data!');
  }
});


// ****************** Delete Operations

app.get('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send('User not found!');
    }
    res.send('User deleted successfully!'); // Change to a proper response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user!');
  }
});


// // Route to update obesity data by ID
// app.put('/update-obesity/:id', (req, res) => {
//   const id = req.params.id; // Extract the ID from the request parameters
//   const updateData = req.body; // Extract the update data from the request body

//   // Use findByIdAndUpdate to update the document
//   ObesityData.findByIdAndUpdate(id, updateData, { new: true })
//     .then((result) => {
//       if (!result) {
//         return res.status(404).send({ message: 'Data not found' });
//       }
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err); // Send the error as a response
//     });
// });


// app.put('/update-obesity', (req, res) => {
//   const id = req.params.id; // Extract the ID from path parameters
//   const updateData = req.body; // Extract the update data from the request body

//   // Use findByIdAndUpdate to update the document
//   ObesityData.findByIdAndUpdate(id, updateData, { new: true })
//     .then((result) => {
//       if (!result) {
//         return res.status(404).send({ message: 'Data not found' });
//       }
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send(err); // Send the error as a response
//     });
// });

// app.get('/about', (req, res) => {
//   res.render('./pages/about', { title: 'About Sales Blog'});
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

//var express = require('express');
//var app = express();
//app.listen(3000, ()=> {
//  console.log('Server listening on 3000');
//})

//const mongoose = require('mongoose');
//mongoose.connect('URL', () => {
//  console.log('Connected to Mongo DB successfully!!');
//})

//APIs for a routing mechanism
//body parser to handle HTTP POST calls
//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

//defining the route with express
//const router = express.Router();
//const User = require('model/user.js');
//const bcrypt = require('bcrypt');
//router.post('/user', (request, response) => {
 // const user = new User ({
 //   firstname : request.body.firstname,
  //  lastname: request.body.lastname,
  //  username: request.body.username,
//    password: request.body.password,
//    email: request.body.email
//  });

//bcrypt.hash(user.password, 10, function(err, hash) {
//  if(err){
//    return next(err);
 // }

//user.password = hash;
//user.save().then(data => {
 // console.log('Successfully created a new user');
//}).catch(error => {

 // })  
//})
//}) .module.exports = router


