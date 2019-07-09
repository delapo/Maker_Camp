const express = require('express');
const app = express();
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const srv = require('./server.js');
const nodeMailer = require('nodemailer');
const generator = require('generate-password');

app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

exports.getBabyByParent = function(req, res)
{
    //srv.mysql_co.query("SELECT id FROM users WHERE access_token = ?", [srv.getAccessToken(req)], (erro, rowA) => {
        //if (erro) throw erro;
        srv.mysql_co.query("SELECT baby_id FROM baby_has_parents WHERE user_id = ?", [req.body.id], (err, rows) => {
            if (err) throw err;
            let babies = [];
            let babies_id = [];
            rows.forEach(baby => {
                if (babies_id.indexOf(baby.baby_id) === -1)
                    babies_id.push(baby.baby_id);
            });
            babies_id.forEach(baby => {
                srv.mysql_co.query("SELECT * FROM baby WHERE id = ?", [baby], (err, rows) => {
                    if (err) throw err;
                    babies.push(rows[0]);
                    if (babies_id.indexOf(baby)+1 === babies_id.length)
                        res.send({babies, error: false}); 
                });
            });
        });
   // });
}

exports.getBaby = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM baby", (err, rows) => {
        if (err) throw err;
        let babies = [];
        rows.forEach(element => {
            babies.push(element);
        });
        res.send({babies, error: false});
    });
}

exports.addBaby = function(req, res)
{
    srv.mysql_co.query("INSERT INTO infos() VALUES()", (err, row, field) => {
        if (err) throw err;
        let infos_id = row.insertId;
        const baby = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            weight: req.body.weight,
            height: req.body.height,
            infos_id: infos_id,
            identifier: req.body.identifier
        };
        srv.mysql_co.query("INSERT INTO baby SET ?", [baby], (err, row, field));
        res.send({error: false});
    });
}

exports.addParentToBaby = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, rows) => {
		if (err) throw err;
        if (rows[0] != null) {
            srv.mysql_co.query("INSERT INTO baby_has_parents(user_id, baby_id) VALUES(?, ?)", [rows[0].id, req.params.id], (errB, rowsB, fieldsB) => {
                if (errB) throw errB;
                res.send({error: false});
            });
        } else {
            let new_pass = generator.generate({
                length: 10,
                numbers: true
            });
            bcrypt.genSalt(10, (errC, salt) => {
                if (errC) throw errC;
                bcrypt.hash(new_pass, salt, function(errH, hash) {
                    if (errH) throw errH;
                    const parents = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        role: 2,
                    };
                    srv.mysql_co.query("INSERT INTO users SET ?", [parents], (errB, row) => {
                        if (errB) throw errB;
                        const baby_has_parents = {
                            user_id: row.insertId,
                            baby_id: req.params.id
                        }
                        srv.mysql_co.query("INSERT INTO baby_has_parents SET ?", [baby_has_parents], (errC) => {
                            if (errC) throw errC;
                            res.send({error: false});
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
                                from: parents.lastname + ' ' + parents.firstname,
                                to: req.body.email,
                                subject: "First password",
                                text: "Hi " + parents.lastname + ' ' + parents.firstname + "\nHere is your first password : " + new_pass + "\nWelcome to our platform, \nyou can connect on BabyBoom mobil application with your email and the given password. \nThank for the trust you give us ! \nCongratulation you are parent !! \nXOXO"
                            };
                            transporter.sendMail(mailOptions, (errA, info) => {
                                if (errA) throw errA;
                                res.send({error: false});
                            });
                        });
                    });
                });
            });
        }
    });
}

exports.getBabyById = function(req, res)
{
    srv.mysql_co.query("SELECT * FROM baby INNER JOIN infos ON baby.infos_id = infos.id WHERE baby.id = ?;", [req.params.id], (err, rows) => {
        if (err) throw err;
        res.send({baby: rows[0], error: false})
    });
}

exports.deleteBaby = function(req, res)
{
    srv.mysql_co.query("DELETE FROM baby_has_parents WHERE baby_id = ?", [req.params.id], (errC) => {
        if (errC) throw errC;
        srv.mysql_co.query("SELECT infos_id FROM baby WHERE id = ?", [req.params.id], (errS, rowS) => {
            if (errS) throw errS;
            let infos_id = rowS[0];
            srv.mysql_co.query("DELETE FROM baby WHERE id = ?", [req.params.id], (errA) => {
                if (errA) throw errA;
                srv.mysql_co.query("DELETE FROM infos WHERE id = ?", [infos_id], (errD) => {
                    if (errD) throw errD;
                    res.send({error: false});
                });
            });
        });
    });
}

exports.updateInfo = function(req, res)
{
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    srv.mysql_co.query("SELECT * FROM baby INNER JOIN infos ON baby.infos_id = infos.id WHERE device_id = ?", [req.body.device_id], (errB, rowsB, fieldsB) => {
        if (errB) throw errB;
        let baby = rowsB[0];
        console.log(baby);
        let floatH_latitude = baby.hospital_latitude - Math.floor(baby.hospital_latitude)*100;
        let floatH_longitude = baby.hospital_longitude - Math.floor(baby.hospital_longitude)*100;
        srv.mysql_co.query("UPDATE infos SET temperature = ?, longitude = ?, latitude = ?, heartbeat = ? WHERE device_id = ?", [req.body.temperature, longitude, latitude, req.body.bpm, req.body.device_id], (errA) => {
            if (errA) throw errA;
        });
        if (req.body.bpm <= 70 || req.body.bpm >= 190 || req.body.temperature <= 36 || req.body.temperature >= 37.5 || longitude <= floatH_longitude - 50 || longitude >= floatH_longitude + 50 || latitude <= floatH_latitude - 50 || latitude >= floatH_latitude + 50) {
            srv.mysql_co.query("SELECT * FROM users WHERE role != 2", (errC, rowsC, fieldsC) => {
                if (errC) throw errC;
                rowsC.forEach(nurse => {
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: "apitestemailSDCMAKE",
                            pass: "azertyuiop1234567890--"
                        }
                    });
                    let mailOptions = {
                        from: "Baby Boom - WARNING",
                        to: nurse.email,
                        subject: "BABY WARNING - " + baby.firstname + ' ' + baby.lastname,
                        text: "Hi " + nurse.firstname + " " + nurse.lastname + "\n The baby " + baby.firstname + ' ' + baby.lastname + " is in danger\nInfos :\nTemperature : " + req.body.temperature + " °C\nHeartbeat : " + req.body.bpm + " BPM\nPosition : \n\t\tLongitude = " + req.body.longitude + "\n\t\tLatitude = " + req.body.latitude + "\nXOXO"
                    };
                    transporter.sendMail(mailOptions, (errD, info) => {
                        if (errD) throw errD;
                        console.log("Message sent to " + info.envelope.to);
                        res.send({error: false});
                    });
                });
            });
        } else
            res.send({error: false});
    });
}
