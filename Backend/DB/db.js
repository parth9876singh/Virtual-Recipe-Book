const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.DB_URL,{}).then(()=>{
        console.log("Database is connected")
    }).catch((err)=>{
        console.log('Error in connecting database',err);
    })
}

module.exports = connectDB;