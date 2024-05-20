const express = require('express');
// const mongoose = require("mongoose");
const cors = require('cors');

const customers = require('./seed');

const app = express();


// mongoose.connect("mongodb://localhost:27017/assignment")
//   .then(() => console.log("Database Connection Successful!"))
//   .catch((err) => console.log(err));

process.on('unhandledRejection', (reason) => {
    console.log(reason);
    process.exit(1);
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // line 20, 21 is for parsing body of request and encoded urls
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Allow-Headers',
    ],
})); //cors middleware for Access Control Allow Origin error or to allow access to api from different host other than self

//GET request for getting customers by pages 
app.get("/api/getAll", (req, res) => {
    try {
        // getting page number through query of request
        const { page } = req.query;

        // initial size of data to send
        const pageSize = 5;

        // getting total pages
        const totalPages = Math.ceil(customers.length / pageSize);

        res.send({ success: true, customers: customers.slice((page - 1) * pageSize, page * pageSize), totalPages })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: error.message })
    }
});

// this PUT request will change the status of customers
app.put("/api/changeStatus", (req, res) => {
    try {
        const { id } = req.body;
        const index = customers.findIndex((obj) => obj.custId === id);
        if (index || index > -1) {
            customers[index].custStatus = !customers[index].custStatus;
            return res.send({ success: true })
        }
        return res.send({ success: false, message: "customer not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false })
    }
})

app.listen(4000, () => {
    console.log("express server in running on port 4000");
})