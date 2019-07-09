const mysql = require('mysql');

const mysql_co = mysql.createConnection({
    host: "localhost",
    user: "superman",
    password: "super"
});

mysql_co.connect(function(err) {
    if (err) throw err;
    mysql_co.query("DROP DATABASE IF EXISTS SDCMAKE");
    mysql_co.query("CREATE DATABASE SDCMAKE", function (err, result) {
        if (err) throw err;
        console.log("Base de données \"SDCMAKE\" créée.");
        mysql_co.query("USE SDCMAKE");
        mysql_co.query("CREATE TABLE users(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, email VARCHAR(100) UNIQUE, firstname VARCHAR(100), lastname VARCHAR(100), password VARCHAR(240), role INT, phoneNumber VARCHAR(15), access_token VARCHAR(1300)) ENGINE=INNODB;");
        mysql_co.query("CREATE TABLE infos(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, temperature INT, longitude FLOAT, latitude FLOAT, heartbeat FLOAT, device_id INT) ENGINE=INNODB;");
        mysql_co.query("CREATE TABLE baby(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, firstname VARCHAR(100), lastname VARCHAR(100), weight FLOAT, height FLOAT, identifier VARCHAR(10) UNIQUE, infos_id INT NOT NULL, FOREIGN KEY (infos_id) REFERENCES infos(id)) ENGINE=INNODB;");
        mysql_co.query("CREATE TABLE baby_has_parents(id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, baby_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (baby_id) REFERENCES baby(id)) ENGINE=INNODB;", (err, rows, field) => {
            if (err) throw err;
            console.log("Tables \"users\", \"infos\", \"baby\" et \"baby_has_parents\" créées.");
            mysql_co.end();
        });
    });
});
