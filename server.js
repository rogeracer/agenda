
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTIONSTRING, { 
	useNewUrlParser: true,
	useUnifiedTopology: true, 
	useFindAndModify:false
})
	.then(()=>{
		console.log("conectou agora...");
		app.emit("pronto")
	})
	.catch(e => console.log(e.error));

const session =require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const {middlewareGlobal,checkCsrfError,csrfMiddleware} = require("./src/middlewares/middleware");

app.use(helmet());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname,"public")));


app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

const sessionOptions = session({
	secret:"I am the king of the mountain. I am fire. I am death",
	store: new MongoStore({mongooseConnection:mongoose.connection}),
	resave:false,
	saveUninitialized:false,
	cookie:{
		maxAge: 1000 * 60 * 60 *24 * 7,
		httpOnly:true
	}
});


app.use(sessionOptions);
app.use(flash());

app.use(csrf());


app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(middlewareGlobal);
app.use(routes);

app.on("pronto", ()=>{
	
	app.listen(3000,()=>{
	console.log("Acesse em http://localhost:3000")
	console.log("Servidor escutando na porta 3000.")
	})
})




