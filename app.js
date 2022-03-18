
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')

const route = require('./config/route');
const {Sequelize} = require('./sequelize');
const config = require('./config/config');

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use('/public', express.static(path.join('public')));
app.use(function (req, res, next) {
  console.log(`:::::: Url :: ${req.hostname + req.url} :: Parameters :: ${JSON.stringify(req.body)}`);
  next();
});

app.use('/', route);
const server = app.listen(config.port, () => {
  console.log(`:::::::: Node Server ${config.port} Successfuly Started ::::::::`);
});

// process.on('SIGTERM', () => {
//   server.close(() => {
//   console.log('Process terminated');
//   });
// });
