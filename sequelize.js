const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const userTable = require('./models/users');
const eventTable = require('./models/events');
const participantTable = require('./models/participants');
const sequelize = new Sequelize('thinkwik', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

const users = userTable(sequelize, Sequelize)
const evetns = eventTable(sequelize, Sequelize)
const participants = participantTable(sequelize, Sequelize)
try {
    sequelize.authenticate();
    console.log("connected successfully..");
} catch (error) {
    console.log("something went wrong", error);
}


sequelize.sync({alter:true})
    .then(() => {
        console.log("connected to database successfully");
    });

module.exports = {
     users,
     evetns,
     participants
}