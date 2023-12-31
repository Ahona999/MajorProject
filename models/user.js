const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

//Password and Usrname are not added because they are automatically added and hashed and salted by passportLocalMongoose//
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

