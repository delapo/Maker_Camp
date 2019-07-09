const express = require('express');
const app = express();
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const srv = require('./server.js');
const nodeMailer = require('nodemailer');
const generator = require('generate-password');
const bcrypt = require('bcrypt');

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

exports.register = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, rows) => {
		if (err) throw err;
        if (rows[0] != null)
            return res.json({error: true, message: "Email déjà prise"});
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, function(errC, hash) {
                if (err) throw err;
                const user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                    role: 1,
                };
                srv.mysql_co.query("INSERT INTO users SET ?", [user], (err) => {
                    if (err) throw err;
                    res.send({error: false});
                });
            });
        });
    });
}

exports.login = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, rows) => {
        if (err) throw err;
        if (rows.length == 0)
            return res.json({error: true, message: "Email inexistante"});
        let user = rows[0];
        if (typeof req.body.password !== 'undefined') {
            bcrypt.compare(req.body.password, user.password, function(err, rer) {
                if (err) throw err;
                if (rer) {
                    jwt.sign({id: user.id}, 'privatekey', (err, token) => {
                        if (err) throw err;
                        user.access_token = token;
                        srv.mysql_co.query("UPDATE users SET access_token = ? WHERE id = ?;", [token,user.id], (err) => {
                            if (err) throw err;
                            res.json({token: token, error: false, role: user.role, id: user.id});
                        });
                    });
                } else
                    return res.send({error: true, message: "mot de passe incorrect"});
            });
        }
    });
}

exports.forgetPassword = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, row, fields) => {
        if (err) throw err;
        if (row.length == 0)
            return res.send({error: true, message: "Email inexistante"});
        let user = row[0];
        let new_pass = generator.generate({
            length: 10,
            numbers: true
        });
        let email = "apitestemailSDCMAKE@gmail.com";
        let password = "azertyuiop1234567890--"
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        });
        let mailOptions = {
            from: user.lastname + ' ' + user.firstname,
            to: req.body.email,
            subject: "Forgot password",
            text: "Hi " + user.lastname + " " + user.firstname + "\nHere is your new password : " + new_pass + "\nPlease be careful and do not forget your password next time ! \nThank for the trust you give us ! \nXOXO"
        };
        transporter.sendMail(mailOptions, (errA, info) => {
            if (errA) throw errA;
            console.log("Message sent to " + info.envelope.to);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(new_pass, salt, function(errC, hash) {
                    if (errC) throw errC;
                    srv.mysql_co.query("UPDATE users SET password = ? WHERE id = ?;", [hash, user.id], (errD, row, fields) => {
                        if (errD) throw errD;
                        res.send({error: false});
                    });
                });
            });
        });
    });
}

exports.getRole = function(req, res)
{
   // srv.mysql_co.query("SELECT role FROM users WHERE access_token = ?", [srv.getAccessToken()], (err, row, field) => {
    srv.mysql_co.query("SELECT role FROM users WHERE id = ?", [req.body.id], (err, row, field) => { 
        if (err) throw err;
        res.send({role: row[0]});
    });
}
