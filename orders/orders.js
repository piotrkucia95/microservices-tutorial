const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const Order = require('./order.js');

const app = express();
mongoose.connect('mongodb://piotr:password1@ds239055.mlab.com:39055/ordersservice', () => {
    console.log('Connected to database!');
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/orders', (req, res) => {
    Order.find().then((orders) => {
        res.json(orders);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order) {
            rp.get('http://localhost:5555/customer/' + order.customerId).then((response) => {
                response = JSON.parse(response);
                var orderObject = {
                     'customerName': response.name,
                     'bookTitle': ''
                 };

                 rp.get('http://localhost:3000/book/' + order.bookId).then((response) => {
                    response = JSON.parse(response);
                    orderObject.bookTitle = response.title;
                    res.json(orderObject);
                }).catch();

            }).catch();

        } else res.sendStatus(404);
    }).catch((err) => {
        if(err) throw err;
    })
});

app.post('/order', (req, res) => {
    req.body.customerId = mongoose.Types.ObjectId(req.body.customerId);
    req.body.bookId = mongoose.Types.ObjectId(req.body.bookId);
    Order.create(req.body).then((order) => {
        res.json(order);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.delete('/order/:id', (req, res) => {
    Order.findOneAndRemove(req.params.id).then(() => {
        res.send('Order removed successfully.');
    }).catch((err) => {
        if(err) throw err;
    });
});

app.listen('7777', () => {
    console.log('Listening on port: 7777');
});