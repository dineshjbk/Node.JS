const mysql = require('mysql');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mysqlConnection = mysql.createConnection({
    database: 'ProductDB',
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    multipleStatements: 'true'

});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB Connected');
    else
        console.log('Connection Failed \n Error: ' + JSON.stringify(err, undefined, 2));
});


var sql = "CREATE TABLE IF NOT EXISTS Customer(ID int AUTO_INCREMENT PRIMARY KEY, Name varchar(255),Price varchar(255))";
mysqlConnection.query(sql, function (err) {
    try {
        if (err) throw err;
        console.log("Table Created")
    } catch (error) {
        console.log('Create Table Error');
        console.log(error);
    }
});

app.get('/customer', (req, res, next) => {
    console.log(1);
    mysqlConnection.query('SELECT * FROM Customer', (err, rows, fields) => {

        try {
            if (err) throw err;
            console.log(rows);
            res.status(200).json({
                message: 'Rows Printed',
                list: rows
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Something Went Wrong'
            })
        }

    });
});





app.post('/customer',function(req,res){
    var Name = req.body.Name;
    var Price = req.body.Price;

    mysqlConnection.query("INSERT INTO Customer(Name, Price)",[Name, Price], function(err, rows, fields){
        try {
            if (err) throw err;
            console.log(rows);
            res.status(200).json({
                message: 'Affected',
                list: rows
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'GO Check your code!!!'
            })
        }
    });
});


module.exports = app;
