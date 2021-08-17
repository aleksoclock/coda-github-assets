require('dotenv').config();
const express = require('express');
const router = require('./app/router');
const PORT = process.env.PORT || 5050;

const app = express();

app.use(router);

app.use( (req, res, next) => {
    res.status(404).json({result: "404 - Not found"});
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});