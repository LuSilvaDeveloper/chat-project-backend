// Creating connection with mongodb
const mongoose = require('mongoose');
require('dotenv').config();

// Connecting to my cluster
// langara-tribe_chat

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.lkqhszg.mongodb.net/?retryWrites=true&w=majority`, ()=> {
    console.log('connected to mongodb')
})

