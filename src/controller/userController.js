const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken')
const validator = require('../validator/validator')
const secretKey = 'CACA'

// -------------- REGEX 

const nameRegex = /^[ a-z ]+$/i
const mobileRegex = /^[6-9]\d{9}$/
const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

// -------------- Create USER

const createUser = async function(req, res){
    try{
        const data = req.body
        const {name, phone, email, password} = data

        if(!validator.isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        }
        if(!name){
            return res.status(400).send({ status: false, message: "Name is required" })
        }
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is in wrong format" })
        };
        if (!name.match(nameRegex)) {
            return res.status(400).send({ status: false, message: "Please Provide correct input for name" })
        };
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone is required" })
        };
        if (!mobileRegex.test(phone)) {
            return res.status(400).send({ status: false, message: "Please Provide valid Mobile No" })
        };
        let duplicateMobile = await userModel.findOne({ phone: phone });
        if (duplicateMobile) {
            return res.status(400).send({ status: false, message: "Mobile No. already exists!" });
        };
        if (!email) {
            return res.status(400).send({ status: false, message: "email is required" })
        };
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Please Enter Email in valid Format" })
        };
        let duplicateEmail = await userModel.findOne({ email: email });
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: "Email already exists!" });
        };
        if (!password) {
            return res.status(400).send({ status: false, message: "password is required" })
        };
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is in wrong format" })
        };
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password should be between 8 and 15 characters." })
        };

        let savedData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: savedData })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

// -------------- User Login

const loginUser = async function(req, res){
    try{
        const data = req.body;
        const{email, password} = data;

        if(!validator.isValidRequestBody(data)){
            return res.status(400).send({ status: false, message: "Invalid request parameters,Empty body not accepted." })
        }
        if(!email){
            return res.status(400).send({ status: false, message: "Email is required." })
        }
        if(!validator.isValid(email)){
            return res.status(400).send({ status: false, message: "Email is in wrong format." })
        }
        if(!password){
            return res.status(400).send({ status: false, message: "Password is required." })
        }
        if(!validator.isValid(password)){
            return res.status(400).send({ status: false, message: "Password is in wrong format." })
        }

        const findCredentials = await userModel.findOne({ email, password})
        if(!findCredentials){
            return res.status(400).send({ status: false, message: "Invalid login credentials." })
        }

        const id = findCredentials._id
        const token = await jwt.sign({ userId: id}, secretKey, { expiresIn: "24h" })
        return res.status(201).send({ status: true, message: "User logged in successfully.", token: token })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, loginUser}
