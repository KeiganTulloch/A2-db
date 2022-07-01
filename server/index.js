const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser')
var config = require('./db/config');


const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
app.use(bodyParser.json());


app.use(cors());

var db = mysql.createConnection({
    host: config.mySQLConfig.host,
    user: config.mySQLConfig.user,
    password: config.mySQLConfig.password,
    database: config.mySQLConfig.database,
    connectTimeout: config.mySQLConfig.timeout
});

app.get("/query", (req, res) => {
    let sqlQuery = "select partName895, currentPrice895, partNo895  from ktulloch.Parts895";
    
    console.log('parts request');
    db.query(sqlQuery, function(err, resp){
        if (err){
            throw err;
        };
        results = Object.values(JSON.parse(JSON.stringify(resp)))
        res.send(results);
    });
});

app.post("/submitPo", (req, res) => {
    poNo = req.body.poNo895;
    date = req.body.datePO895;
    status = req.body.status895; 
    clientId = req.body.clientId895;
        
    console.log('po submitted');
    db.query('insert into POs895 (poNo895, datePO895, status895, clientId895) VALUES(?,?,?,?)', [poNo, date, status, clientId], function(err, resp){
        if (err){
            throw err;
        }
        results = Object.values(JSON.parse(JSON.stringify(resp)))
        console.log(results);
        res.send(results);
    });
    
});

app.post("/submitLines", (req, res) => {
    poNo = req.body.PoNo895;
    client = req.body.clientId895;
    lineNo = req.body.lineNo
    part = req.body.partNo895;
    quantity = req.body.quantity; 
    price = req.body.price;
        
    console.log('line submitted');
    db.query('select * from Parts895 where partNo895 = ?', [part], function(err, resp){
        if (err){
            throw err;
        }
        if (resp[0]['currentPrice895'] == price.toString() && resp[0]['QoH895'] > quantity){
            console.log("line success");
            db.query('insert into Lines895 (lineNo895, noOfUnits895, linePrice, POs895_PoNo895, POs895_clientId895, Parts895_partNo895) VALUES(?,?,?,?,?,?)', [lineNo, quantity, price, poNo, client, part], function(err, resp){
                if (err){
                    throw err;
                }
                results = Object.values(JSON.parse(JSON.stringify(resp)))
                console.log(results);                    
                res.send(results);
            });
        }
            else{
            res.send('error')
        }
    });        
});


app.post("/submitClient", (req, res) => {
    clientId = req.body.clientId895;

    console.log('pos requested');
    db.query('select * from POs895 where clientId895 = ?', [clientId], (err, resp) => {
        if (err){
            throw err;
        }
        results = Object.values(JSON.parse(JSON.stringify(resp)))
        res.send(results);
    });
});

app.post("/getLines", (req, res) => {
    poId = req.body.poNo895;

    console.log('lines requested');
    db.query('select * from Lines895 where POs895_PoNo895 = ?', [poId], (err, resp) => {
        if (err){
            throw err;
        }
        results = Object.values(JSON.parse(JSON.stringify(resp)))
        res.send(results);
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});