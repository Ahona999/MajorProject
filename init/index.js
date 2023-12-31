const mongoose = require("mongoose");
const initData = require("./data.js");//accessing all sample listings
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
.then(() =>{
    console.log("Mongoose is connected");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "653093e9976c11dcc9c8ac2f"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};


initDB();