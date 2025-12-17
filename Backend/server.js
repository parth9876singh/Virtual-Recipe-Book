const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const connectDB = require('./DB/db')
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow Vite default ports
    credentials: true
}));


const userRoutes = require('./routes/user.route.js')
const googleAuthRoutes = require("./routes/googleAuth.route");
const recipeRoutes = require('./routes/recipe.route.js')
app.use('/user', userRoutes)
app.use("/auth", googleAuthRoutes)
app.use('/recipe', recipeRoutes)
app.use('/recipe', recipeRoutes)
app.use("/upload", require("./routes/upload.route"));
app.use("/ai", require("./routes/ai.route"));

















const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`)
})






