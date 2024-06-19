const mongoose = require('mongoose');
const { type } = require('os');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    },
    status:{
        type:String,
        default:'active'
    },
    profilePicture:{
        type:String,
        default:"",
    }
},
{
    timestamps:true
}
);


module.exports = mongoose.model("users", userSchema);
