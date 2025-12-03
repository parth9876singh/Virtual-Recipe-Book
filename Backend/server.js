const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const connectDB = require('./DB/db')
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors())


const userRoutes = require('./routes/user.route.js')

app.use('/user',userRoutes)

















const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})






