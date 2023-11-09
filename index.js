const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const Datastore = require("nedb");
const database = new Datastore("./data/database.db");
database.loadDatabase();
require('dotenv').config();

app.use(express.static("./src"));
app.use(express.json());

function verifyJwt(req, res, next) {
    jwt.verify(req.body.jsonwebtoken, process.env.JWT_SECRET, (err, decoded) => {
        if(decoded) {
            res.locals.decoded = decoded;
            next();
        } else {
            res.send({error: true, message: "Invalid jwt token!"});
        }
    });
}

app.post("/register", (req, res) => {
    const hashedPass = bcrypt.hashSync(req.body.password, 10);
    database.find({email: req.body.email}, (err, data) => {
        if(data.length == 0) {
            database.insert({email: req.body.email, password: hashedPass, trainingprograms: []});
            res.send({error: false, message: "User registered successfully!"});
        } else {
            res.send({error: true, message: "User already exists!"});
        }
    });
});

app.post("/login", (req, res) => {
    database.findOne({email: req.body.email}, (err, data) => {
        if(err) {
            return res.send({error: true, message: "An error occured!"});
        }
        if(data.length == 0) {
            return res.send({error: true, message: "User does not exist!"});
        }
        bcrypt.compare(req.body.password, data.password, (err, result) => {
            if(result) {
                return res.send({error: false, jsonwebtoken: jwt.sign({email: data.email}, process.env.JWT_SECRET, {expiresIn: "24h"})});
            } else {
                return res.send({error: true, message: "Incorrect email or password!"});
            }
        });
    });
});

app.get("/trainingprogram/getall", (req, res) => {
    let allTrainingPrograms = [];
    database.find({}, (err, data) => {
        data.forEach(user => {
            user.trainingprograms.forEach(trainingprogram => {
                trainingprogram.author = user.email;
                allTrainingPrograms.push(trainingprogram);
            });
        });
        res.send({error: false, trainingprograms: allTrainingPrograms});
    });
});

app.post("/trainingprogram/create", verifyJwt, (req, res) => {
    const newTrainingProgram = {
        name: req.body.name,
        purpose: req.body.purpose,
        amount: req.body.amount,
        exercises: req.body.exercises,
        author: res.locals.decoded.email,
        id: crypto.randomUUID()
    }
    try {
        database.findOne({email: res.locals.decoded.email}, (err, data) => {
            const newArray = data.trainingprograms;
            newArray.push(newTrainingProgram);
            database.update({email: res.locals.decoded.email}, {$set: {trainingprograms: newArray}}, {}, (err, numReplaced) => {
                res.send({error: false, message: `Updated ${numReplaced} query/queries sucessfully!`})
                database.loadDatabase();
            });
        });
    } catch {
        res.send({error: true, message: "Failed to create query!"});
    }
});
app.post("/trainingprogram/delete", verifyJwt, (req, res) => {
    try {
        database.findOne({email: res.locals.decoded.email}, (err, data) => {
            const newArray = data.trainingprograms.filter(obj => {
                return obj.id !== req.body.id;
            });
            if(data.trainingprograms.length == newArray.length) {
                return res.send({error: true, message: "Query with that id does not exist!"})
            }
            database.update({email: res.locals.decoded.email}, {$set: {trainingprograms: newArray}}, {}, (err, numReplaced) => {
                res.send({error: false, message: `Deleted 1 query sucessfully!`});
                database.loadDatabase();
            });
        });
    } catch {
        res.send({error: true, message: "Failed to delete query!"});
    }
});

app.listen(3000, () => {
    console.log("App is running strong! (pun intended)"); // Skriver dårlig humor til konsollen
});