const mysql = require('mysql');
const express = require('express');
const app = express();
const morgan = require('morgan');
const srv = require('./server.js');
const baby = require('./babyController.js');
const user = require('./userController.js');

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

exports.mysql_co = mysql.createConnection({
	host: 'localhost',
    user: 'superman',
    password: 'super',
	database: 'SDCMAKE'
});

app.listen(3000, () => {
	console.log("Server started on the port 3000");
});

app.post("/forgetPassword", (req, res) => {
    user.forgetPassword(req, res);
});

app.post("/register", (req, res) => {
    user.register(req, res);
});

app.post("/login", (req, res) => {
	user.login(req, res);
});

app.post("/getbabybyparent", (req, res) => {
    baby.getBabyByParent(req, res);
});

app.post("/addbaby", (req, res) => {
    baby.addBaby(req, res);
});

app.post("/addparenttobaby/:id", (req, res) => {
    baby.addParentToBaby(req, res);
});

app.get("/getbabies", (req, res) => {
	baby.getBaby(req, res);
});

app.get("/getbabybyid/:id", (req, res) => {
	baby.getBabyById(req, res);
});

app.delete("/deletebaby/:id", (req, res) => {
	baby.deleteBaby(req, res);
});

app.post("/getrole", (req, res) => {
	user.getRole(req, res);
});

app.post("/updateinfo/", (req, res) => {
	baby.updateInfo(req, res);
});

function verifyToken(req, res, next) 
{
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined') {
		srv.mysql_co.query("SELECT * FROM users WHERE access_token = ?", [bearerHeader.split(' ')[1]], (err, rows) => {
			if (err) throw err;
			if (rows[0] == null)
				res.send({'error':true, "message":"access_token inconnu"});
			else if (rows[0].access_token === bearerHeader.split(' ')[1])
				next();
			else 
				res.send({'error':true, "message":"access_token incorrect"});
		});
	} else
		res.send({'error':true, "message":"pas d'access_token"});
}

exports.getAccessToken = function(req)
{
	return req.headers['authorization'].split(' ')[1];
}
