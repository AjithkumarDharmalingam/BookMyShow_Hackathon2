var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const {dbUrl} = require('../config/dbConfig')
const {UserModel} = require('../schema/usersSchema')
const {MailService} = require('./../service/mailservice')
const {hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin} = require('../config/auth')
mongoose.connect(dbUrl)

router.post('/login',async(req,res)=>{
  try {
     let user = await UserModel.findOne({email:req.body.email})
     if(user)
     {
      if(await hashCompare(req.body.password,user.password))
      {
        let token = await createToken({email:user.email,firstName:user.firstName,lastName:user.lastName,role:user.role})
        res.status(200).send({message:"Login Successfull",token,role:user.role})
      }
      else
      {
        res.status(400).send({message:"Invalid Credential"})
      }
     }
     else{
      res.status(500).send({message:"Email does not exists"})
     }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.post('/signup',async(req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
     if(!user){
      req.body.password = await hashPassword(req.body.password)
      let doc = new UserModel(req.body)
      await doc.save()
      res.status(201).send({
       message:"User Created Successfully"
     })
     }
     else{
      res.status(400).send({message:"Email Id already exists"})
     }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
})

router.post('/send-email',validate,async(req,res)=>{
  try {
    let user = await UserModel.find({},{email:1,firstName:1,lastName:1})
    await MailService({})
    res.status(200).send({
      message:"Ticket Booked Successfully",
      user
    })
  } catch (error) {
    console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
  }
})


module.exports = router;
