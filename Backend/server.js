const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const connectDB = require('./DB/db')
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())





















const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})






