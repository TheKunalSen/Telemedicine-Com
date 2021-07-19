var express = require("express");
var bodyParser = require("body-parser");
var fast2sms = require("fast-two-sms");
require("dotenv").config();
var mongoose = require("mongoose");
var multer = require("multer");
const User = require("./modal/regis");
const bcrypt = require("bcryptjs");
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage });
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", "public");
mongoose.connect("mongodb://Localhost:27017/logs", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
var db = mongoose.connection;
db.on("error", () => console.log("Error in connecting to Mongo"));
db.once("open", () => console.log("Connected to database"));

app.post("/signup", upload.single("avatar"), async (req, res, cb) => {
	// console.log(req.file);
	console.log(req.body.number);
	usernumberreg = await User.findOne({ number: req.body.number }).lean();
	if (usernumberreg == null) {
		var firstName = req.body.first;
		var lastName = req.body.last;
		var username = req.body.username;
		var password = req.body.password;
		var number = req.body.number;
		var password = await bcrypt.hash(password, 10);

		data = {
			firstname: firstName,
			lastname: lastName,
			username: username,
			password: password,
			number: number
		};
		otp = Math.floor(1000 + Math.random() * 9000);
		console.log(otp);
		const response = await fast2sms.sendMessage({
			authorization: process.env.API_KEY,
			message: otp,
			numbers: [req.body.number]
		});
		console.log(response);
		return res.render("otp.html");
	} else {
		res.render("noreg.html", {
			name: "dear user",
			message: "this number is already registered",
			bod: "login",
			linkm: "go to login",
			title: "Already registered"
		});
	}
});
app.post("/otpind", async (req, res) => {
	var otpen = req.body.otpin;

	console.log(otpen, otp);
	if (otpen == otp) {
		console.log(data);
		try {
			const respon = await User.create(data);
			console.log(`successfully registered ${respon}`);
		} catch (e) {
			//   console.log(e);
			if (e.code === 11000) {
				console.log("Username taken");
			}
			throw e;
		}

		return res.redirect("finish.html");
	} else {
		otp = Math.floor(1000 + Math.random() * 9000);
		console.log("try again");
		res.redirect("regis.html");
	}
});

app.get("/regis", (req, res) => {
	console.log("Going to regis page");
	res.redirect("regis.html");
});
app.get("/login", (req, res) => {
	console.log("Going to login page");
	res.redirect("login.html");
});
app.post("/logind", async (req, res) => {
	console.log("Going to logind page");
	const loginuser = req.body.loginname;
	const loginpow = req.body.loginpow;
	const userlogin = await User.findOne({ username: loginuser }).lean();
	// console.log(userlogin);
	if (userlogin != null) {
		if (await bcrypt.compare(loginpow, userlogin.password)) {
			console.log("logged in");
			res.render("noreg.html", {
				name: "",
				message: "Hi! " + loginuser + " You are logged in",
				bod: "login",
				linkm: "exit",
				title: "Welcome"
			});
		} else {
			console.log("wrong password");
			res.render("noreg.html", {
				name: loginuser,
				message: "your password is incorrect",
				bod: "login",
				linkm: "Try again",
				title: "Wrong password"
			});
		}
	} else {
		console.log("not registered");
		res.render("noreg.html", {
			name: loginuser,
			message: "you are not registered",
			bod: "regis",
			linkm: "Go register yourself",
			title: "Not registered"
		});
	}
});
app.get("/forget", async (req, res) => {
	res.render("forget.html");
});
app.post("/forgetotp", async (req, res) => {
	usernumber = await User.findOne({ number: req.body.forgetnumber }).lean();
	if (usernumber != null) {
		otp = Math.floor(1000 + Math.random() * 9000);
		console.log(otp);
		const response = await fast2sms.sendMessage({
			authorization: process.env.API_KEY,
			message: otp,
			numbers: [req.body.forgetnumber]
		});
		console.log(response);
		res.redirect("otpforget.html");
	} else {
		res.render("noreg.html", {
			name: "dear user",
			message: "you are not registered",
			bod: "regis",
			linkm: "Go register yourself",
			title: "Not registered"
		});
	}
});

app.post("/otpforget", async (req, res) => {
	if (otp == req.body.otpinforget) {
		res.redirect("newpass.html");
	} else {
		res.render("noreg.html", {
			name: " ",
			message: "wrong otp",
			bod: "forget",
			linkm: "try again",
			title: "invalid otp"
		});
	}
});
app.post("/newpass", async (req, res) => {
	console.log(usernumber._id);
	// console.log(req.body.newpass);
	var newpassword = await bcrypt.hash(req.body.newpass, 10);
	console.log(newpassword);
	const updatepass = async _id => {
		const result = await User.updateOne(
			{ _id },
			{
				$set: {
					password: newpassword
				}
			}
		);
		console.log("updated successfully");
	};
	updatepass(usernumber._id);
	res.render("noreg.html", {
		name: "dear" + usernumber.username,
		message: " your password is updated successfully",
		bod: "login",
		linkm: "Go to login",
		title: "password updated"
	});
});

app
	.get("/", (req, res) => {
		res.set({
			"Allow-access-Allow-Origin": "*"
		});
		return res.redirect("login.html");
	})
	.listen(8080, 'localhost');

console.log("listening");

