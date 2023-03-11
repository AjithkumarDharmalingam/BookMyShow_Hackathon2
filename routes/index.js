var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const {dbUrl} = require('../config/dbConfig')
const {AdminModel} = require('../schema/adminSchema')
const {MailService} = require('./../service/mailservice')
const {hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin} = require('../config/auth')
mongoose.connect(dbUrl)



//create admin
router.post('/admin',validate,async(req,res)=>{
  try {
      let doc = new AdminModel(req.body)
      await doc.save()
      res.status(201).send({
       message:"Admin created Successfully"
     })
     }catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//get admin by id
router.get('/admin/:id',validate,async(req,res)=>{
  try {
    let data = await AdminModel.find({_id:req.params.id})
    res.status(200).send({
     admin:data
   })
} catch (error) {
  console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

//edit admin by id
router.put('/admin/:id',validate,async(req,res)=>{
  try {
    let data = await AdminModel.updateOne({_id:req.params.id},{$set:req.body})
    res.status(200).send({
     message:"Admin Edited Successfully"
   })
} catch (error) {
  console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

router.delete('/admin/:id',validate,roleAdmin,async(req,res)=>{
  try {
    //let doc = await UserModel.findByIdAndDelete(req.params.id)
    let user = await AdminModel.findOne({_id:req.params.id})
    if(user){
      let doc = await AdminModel.deleteOne({_id:req.params.id})
    res.status(200).send({
      message:"User Deleted Successfully"
    })
  }
  else
  {
    res.status(400).send({message:"Invalid Id"})
  }
  } catch (error) {
    console.log(error);
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//get dashboard movie
router.get('/dashboard',validate,async(req,res)=>{
  try {
    let data = await AdminModel.aggregate([
      {
        $group:{_id:"$movie",count:{$sum:1}}
      }
      ])
    res.status(200).send({
     admin:data
   })
} catch (error) {
  console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

//change movie of admin
router.put('/admin/:id/:toMovie',validate, async(req,res)=>{
  try {
    let data = await AdminModel.updateOne({_id:req.params.id},{$set:{movie:req.params.toMovie}})
    res.status(200).send({
     message:"Movie Change Successfully"
   })
   
} catch (error) {
  console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

//get the list of admin under each movie
router.get('/dashboard-list-items/:movie',validate,roleAdmin,async(req,res)=>{
  try {
    let data = await AdminModel.find({movie:req.params.movie})
    res.status(200).send({
     admin:data
   })
} catch (error) {
  console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

// For Seats Booking 

let cinemaSeat = [];
for (let i = 0; i < 10; i++) {
  let SeatChar, SeatPrice;
  if (i === 0) SeatChar = "A";
  else if (i === 1) SeatChar = "B";
  else if (i === 2) SeatChar = "C";
  else if (i === 3) SeatChar = "D";
  else if (i === 4) SeatChar = "E";
  else if (i === 5) SeatChar = "F";
  else if (i === 6) SeatChar = "G";
  else if (i === 7) SeatChar = "H";
  else if (i === 8) SeatChar = "I";
  else if (i === 9) SeatChar = "J";
  if (i === 0 || i === 1 || i === 2 || i === 3 || i === 4) SeatPrice = 190;
  else SeatPrice = 120;
  for (let j = 0; j < 12; j++) {
    cinemaSeat.push({
      seatNumber: SeatChar + (j + 1),
      price: SeatPrice,
      available: true,
      disabilityAccessible: true,
    });
  }
}

router.get("/seat", (req, res) => {
  res.status(200).json(cinemaSeat);
});

const getSeat = (seatNumber, selectedSeat) =>
  selectedSeat.filter((currentSeat) => currentSeat.seatNumber === seatNumber);

router.post("/seat", (req, res) => {
  let Price = 0;
  const { seats } = req.body;

  cinemaSeat = cinemaSeat.map((currentSeat) => {
    if (getSeat(currentSeat.seatNumber, seats).length) {
      Price = Price + parseFloat(currentSeat.price);
      return getSeat(currentSeat.seatNumber, seats)[0];
    }
    return currentSeat;
  });
  res.status(200).json({ msg: "success" });
});




module.exports = router;
