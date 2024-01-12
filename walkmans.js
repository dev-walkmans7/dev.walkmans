const express = require("express");
const path = require("path");
require("dotenv").config();
_ = require("underscore");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const engine = require("ejs-locals");
require("dotenv").config();

config = require("./config/config.js");

//IMPORT ROUTES
const userRoutes = require("./routes/userRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const bodyParser = require("body-parser");

// const apirouter = require('./routes/api');
// const login = require('./routes/login');
app.use(express.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(cors());
app.use(cookieParser());
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(flash());
app.use(
  session({
    secret: "delivery@&beverage@#",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("./public"));

// app.set('views', [join(__dirname, './app/views'), join(__dirname, './app/modules')]);
app.engine("ejs", engine);
app.set("view engine", "ejs"); // set up ejs for templating

// app.use((req, res, next) => {
//   // backbutton prevent
//   res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
//   res.header("Expires", "-1");
//   res.header("Pragma", "no-cache");
//   // Inclide main view path
//   res.locals.messages = req.flash();
//   auth = require(resolve(join(__dirname, "app", "auth")))(req, res, next);
//   app.use(auth.initialize());
//   // This is for admin end
//   if (req.session.token && req.session.token != null) {
//     req.headers["token"] = req.session.token;
//   }
//   // This is for webservice end
//   if (req.headers["x-access-token"] != null) {
//     req.headers["token"] = req.headers["x-access-token"];
//   }
//   next();
// });

app.use("/api", userRoutes);
app.use("/api", profileRoutes);

const server = http.createServer(app);

// app.use(apirouter);
// app.use(login);

require(path.join(__dirname, "/datab", "config"))();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server i sconnected to port http://127.0.0.1:${port}`);
});
