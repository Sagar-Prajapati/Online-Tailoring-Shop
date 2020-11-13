const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const app = express();
const MONGODB_URI = process.env.DATABASE;

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection:'UserSession'
});


const authRoute = require('./routes/authUser');
const userRoute = require('./routes/userService');
const ordersRoute = require('./routes/createOrders');
const carts = require('./routes/carts_Orders');
const adminPanel = require('./routes/adminPanel');
const tailorRoute = require('./routes/tailorRoute');
//const csrfProtection = csrf();

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.set('view engine','ejs');
app.set('views','viewsEjs');
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'viewsEjs')));
app.use('/dsgImg',express.static(path.join(__dirname,'dsgImg')));
app.use('/userUploadedImages',express.static(path.join(__dirname,'userUploadedImages')));

app.use(session({
    secret:'Why To Keep Secret',
    cookie:{
        maxAge:1000*60*60*3 //session is maintained for 3 hours
    },
    store:store,
    resave:false,
    saveUninitialized:false
}));


const PORT = 3000;

app.use(authRoute);
app.use(userRoute);
app.use(ordersRoute);
app.use(carts);
app.use(adminPanel);
app.use(tailorRoute);


mongoose.connect(MONGODB_URI,
    {useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        app.listen(process.env.PORT||PORT); 
        console.log('connected at port '+PORT);
    }).catch(err=>{console.log(err)});



