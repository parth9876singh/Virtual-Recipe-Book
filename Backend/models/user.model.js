const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });


userSchema.methods.generateAuthToken=function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:'24h'
    })
    return token;
}

userSchema.methods.comparePassword=async function(Epassword){
    return bcrypt.compareSync(Epassword,this.password)
}

userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 10);
});





const userModel = mongoose.model("user", userSchema);
module.exports = userModel;