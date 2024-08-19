const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const cookieParser = require("cookie-parser");
const errorHandler = require("./Middleware/error.js")
const path = require('path');
const helmet = require('helmet');


//routes
const authRoutes = require("./Routes/authRoutes.js")
const userRoutes = require("./Routes/userRoutes.js")
const jobTypeRoute = require('./Routes/jobsTypeRoutes.js');
const jobRoute = require('./Routes/jobsRoutes');

//Middlewares --------------------------------
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }
    app.use(bodyParser.json({ limit: "5mb" }));
    app.use(bodyParser.urlencoded({
        limit: "5mb",
        extended: true
    }));
    app.use(cookieParser());
    app.use(cors(
        {
            origin:["https://deploy-mern-1whq.vercel.app"],
            methods: ["POST","GET"],
            credentials: true
        }
    ));
    // adding security headers
    app.use(
        helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "script-src": ["'self'", "https://www.gstatic.com/charts/loader.js"],
            "img-src": ["'self'", "https: data:"]
        }
        })
    )

//routes api 
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobRoute);
app.use('/api', jobTypeRoute);

// error
app.use(errorHandler);

//connecting database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connected"))
.catch((err) => console.log(err));

    __dirname = path.resolve()

    if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
    } else {
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
    }

// error middleware
app.use(errorHandler);

//connect to port 
const port = process.env.PORT 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
