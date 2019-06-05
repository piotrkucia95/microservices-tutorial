const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Customer = require('./customer.js');

const app = express();
mongoose.connect('mongodb://piotr:password1@ds125241.mlab.com:25241/customersservice', () => {
    console.log('Connected to database!');
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer) res.json(customer);
        else res.sendStatus(404);
    }).catch((err) => {
        if(err) throw err;
    })
});

app.post('/customer', (req, res) => {
    Customer.create(req.body).then((customer) => {
        res.json(customer);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.delete('/customer/:id', (req, res) => {
    Customer.findOneAndRemove(req.params.id).then(() => {
        res.send('Customer removed successfully.');
    }).catch((err) => {
        if(err) throw err;
    });
});

app.listen('5555', () => {
    console.log('Listening on port: 5555');
});