// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const { emit } = require("nodemon");
// const cors = require("cors");

// dotenv.config();

// const app = express();
// const PORT =8000;
// const MONGO_URL = "mongodb://localhost:27017/ogmusic";

// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.static('bus'));
// app.use(cors())

// mongoose
//   .connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
//   .then(() => {
//     console.log("DB Connected");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("error");
//   }); //Mongoose connection created

// app.get("/", (req, res) => {
//   res.send("Hello MEAN Stack!");
// });

// const loginSchema = new mongoose.Schema({
//   usrname: { type: String },
//   email: {type: String},
//   password: { type: String },
//   confirmpass: { type: String}
// });



// // let User = require("./app/models/user");
// let user = mongoose.model("login", loginSchema);
// app.get("/getUser", async (req, res) => {
//   // use mongoose to get all students in the database
//   try {
//     const data = await user.find();
//     console.log(data);
//     res.json(data);
//   } catch (error) {
//     console.log(error);
//   }


// });

// app.post("/login",async (req,res)=>{
//     const name = req.body.usrname;
//     const mail = req.body.email;
//     const passwd = req.body.pass;
//     const confirmpasswd = req.body.confirmpass;
//     try{
//       const data = await user.findOne({email: mail});
//       if(data == null){
//         const result = await user.create({usrname: name,email: mail,password: passwd,confirmpass: confirmpasswd});
//         res.json({statusCode:200,message:"Successfully signed up"})
//       }
//       else{
//         res.json({message:"User already exist"})
//       }
//     }
//     catch(error){
//       res.json({message:"Registration failed"})
//       console.log(error);
//     }
// });
// app.post("/signup", (req, res) => {
//  // try {
//     const  name = req.body.name;
//     const mail=req.body.mail;
//     const pass=req.body.pass;
//     const confirm_pass=req.body.pass;

//     console.log("Received data:", { name, mno, mail, pass }); // Log received data
//     user.insertMany({name:name,phone:mno,email:mail,password:pass});

//     /*const savedUser = await newUser.save() ;
//     console.log("Saved user:", savedUser); // Log saved user
//     res.json(savedUser);
//   } catch (error) {
//     console.log("Error saving user:", error); // Log any errors
//     res.status(500).json({ error: "Internal server error" });
//   }*/
// });

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { matches } = require("validator");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/eauction";

app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const loginSchema = new mongoose.Schema({
  usrname: String,
  num: String,
  email: String,
  password: String,
  confirmpass: String
});

const User = mongoose.model("User", loginSchema);

app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.post("/signup", async (req, res) => {
  const { usrname, num, email, password, confirmpass } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    console.log(existingUser);
    if (existingUser) {
      res.json({ message: "User already exists" });
    }
    else {
      const newUser = await User.create({ usrname, num, email, password, confirmpass });
      console.log(newUser)
      console.log("Hi, " + newUser.usrname)
      res.json({ statusCode: 200, message: "Successfully signed up" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  try {
    const user = await User.findOne({ email, password });

    if (user) {
      // User found, redirect to home component or send success response
      if (user.email == "naveensivamurugan@gmail.com") {
        res.json({ statusCode: 201, message: "Login successful", user });
      }
      else {
        res.json({ statusCode: 200, message: "Login successful", user });
      }
    } else {
      // User not found or credentials incorrect
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
//Add Player
const addplayerSchema = new mongoose.Schema({
  playerid: String,
  playername: String,
  baseamt: Number,
  matches: Number
});


const addbid = new mongoose.Schema({
  playerid: String,
  playername: String,
  amount: Number
});
const addbid1 = mongoose.model("bidplayer", addbid);

app.get("/bidplayer", async (req, res) => {


  try {
    const check = await addbid1.find();
    console.log(check);
    res.json(check);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }


});
app.get("/desbidplayer", async (req, res) => {


  try {
    const check = await addbid1.find({}, {}, { sort: { amount: -1 } });
    console.log(check);
    res.json(check);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }


});

app.get("/resultbidplayer", async (req, res) => {


  try {
    const check = await addbid1.findOne({}, {}, { sort: { amount: -1 } });
    console.log("Reuslt player")
    console.log(check);

    res.json(check);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }
});


app.post("/deletebidplayer", async (req, res) => {
  console.log(req.body);

  try {
    // const check=await addbid1.findOne({_id: req.body._id}, {}, { sort: { amount: -1 } });
    // console.log(check);
    const d = await addbid1.deleteMany({ playerid: req.body.playerid });
    const r = await addplayer.deleteOne({ playerid: req.body.playerid });
    if (d) {
      console.log(d);
      res.status(200).json({
        message: "Success"
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }


});
app.get("/addplayer", async (req, res) => {


  try {
    const check = await addplayer.find();
    console.log(check);
    res.json(check);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });

  }


});
app.post("/bidplayer", async (req, res) => {
  const data = {
    playerid: req.body.playerid,
    playername: req.body.playername,
    amount: req.body.amount
  };
  const existingplayer = await addplayer.findOne({ playerid: data.playerid });
  if (existingplayer == null) {
    res.status(202).json({
      message: "Player not found"
    });
  }else if(data.amount < existingplayer.baseamt){
    res.status(203).json({ message: "Entered amount must be greater than base amount" });
  }else {
    const playerdata = await addbid1.insertMany(data);
    if(playerdata)
    res.status(201).json({ message: "player is added" });
    else
    res.status(500).json({message: "Internal Server error"});
  }
});


const addplayer = mongoose.model("addplayer", addplayerSchema);
app.post("/addplayer", async (req, res) => {
  const data = {
    playerid: req.body.playerid,
    playername: req.body.playername,
    baseamt: req.body.baseamt,
    matches: req.body.matches

  };
  console.log(req.body.playerid);
  const existingplayer = await addplayer.findOne({ playerid: data.playerid });
  if (existingplayer) {
    res.status(400).json({ message: "players already exist" });
  }
  else {

    const playerdata = await addplayer.insertMany(data);
    console.log(playerdata);
    res.status(201).json({ message: "player is added" });
  }

});