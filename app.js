if(process.env.NODE_ENV != "production") {
    require("dotenv").config();//only for development purpose for now and when its for production we will not use this dotenv
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//MongoDb Connection from direct atlasdb
const dbUrl = process.env.ATLASDB_URL;

main()
.then(() =>{
    console.log("Mongoose is connected");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));// encodes data not files
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Storing in Mongocloud session --> for production
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
   console.log("ERROR found in MONGO STORE SESSION", err);
});

//----> only for dev
const sessionOptions = //Storing it as a variable
    {
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,// to prevent cross scripting attacks
        },
    };

//Root//
//app.get("/", (req, res) => {
//    res.send("This is working");
//});


//flashs must be used before routers not after//
//app.use(session(store));
app.use(session(sessionOptions));
app.use(flash());

//Just after sessions are used, we use initialiaze and passport.session to track the user seeions//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Always create middlewares to execute flash messages
app.use((req, res, next)=> {
    //Save under locals//
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//userDemo//
//app.get("/userdemo", async(req, res) => {
//    let fakeUser = new User({
//        email: "harry@gmail.com",
//        username: "delta-student"
//    });

//    let registeredUser = await User.register(fakeUser, "helloworld");
 //   res.send(registeredUser);
//});


app.use("/listings", listingsRouter);//Acquiring all from routes ---> then listing.js
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//app.get("/testing", async (req, res) => {
//    let sampleListing = new Listing({
//       title: "My New Villa",
//        description: "Near the beach",
//        price: 1200,
//        location: "Panaji, Goa",
//        country: "India",
//   })

//   await sampleListing.save();
//   console.log(sampleListing);
//   res.send("Testing Successful");
//});



app.all("*", (req, res, next) => {
    next (new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next)=> {
    let {statusCode=500, message="Error Occured"} = err;//handling error
    res.status(statusCode).render("error.ejs", {err});
    //res.status(statusCode).send(message);//
});


app.listen(3000, () => {
    console.log("Server is listening to port 3000");
});
