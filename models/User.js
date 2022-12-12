const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

/**
 * Creating the Schema for mongodb
 * How should be each variable
 * It looks like a JSON
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, "No blank"]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "No blank"],
        index: true,
        validate: [isEmail, "not a valid email"]
    }, 
    password: {
        type: String,
        required: [true, "No blank"]
    }
}, {minimize: false});

/**
 * Before we save the user, we hide the password
 */
UserSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    
    // Function to encrypt the user's password
    bcrypt.genSalt(10, function(err, salt){
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
                return next(err);
            }

            user.password = hash;
            next();
        })
    })
})

UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password; // We don't want to send the password back
    return userObject
}

/**
 * Method that try to find the user credentials
 * IF the user exists, it returns this user
 * IF the user doesn't exist, show err messages
 * 
 * @param {email} email email from the user to search if it already exists
 * @param {password} password password from the user to search if it already exists
 * @returns the user after email and password validation
 */
UserSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({email}); // Process to find the user email
    if(!user) {
        throw new Error('invalid email');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password); // Using bcrypt to validate the password
    if(!isPasswordMatch) {
        throw new Error('invalid password');
    }
    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;