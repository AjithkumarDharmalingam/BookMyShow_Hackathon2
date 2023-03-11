const mongoose = require('mongoose')
const validator = require('validator')

const AdminSchema = new mongoose.Schema({
    firstName:{type:String, require:true},
    middleName:{type:String},
    lastName:{type:String, require:true},
    email:{type:String, require:true,
        validate:(value)=>validator.isEmail(value)
    },
    theater:{type:String, default:"Vetri"},
    movie:{type:String, require:true},
    role:{type:String, default:'admin'},
    date:{type:Date, require:true},
    show:{type:String,require:true},
    payment:{type:Number, require:true},
    seats:{type:Number,require:true},
    password:{type:String, require:true},
    createdAt:{type:Date,default:Date.now()},
},{versionKey:false, collection:'admin'})

const AdminModel = mongoose.model('admin',AdminSchema)
module.exports = {AdminModel}