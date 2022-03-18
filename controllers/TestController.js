const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const models = require('../sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('../config/config');
const { uuid } = require('uuidv4');

module.exports = {
    async test(req, res) {
        try {
            let params = req.body;
            return res.json({ 'status': true });
        } catch (error) {
            console.log('>>>>>> Catch Error :: ', error);
            return res.json({ 'status': false, 'statusCode': -1 });
        }
    },
    async login(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }
        let jwtKey = config.JWT_SECRET_TOKEN;
        if (params.name && params.name.trim() != "" && params.password && params.password.trim() != "") {

            let data = await models['users'].findAll({
                where: {
                    [Op.or]: [
                        { 'email': params.name },
                    ]
                },
            });
            let isValid = data.length > 0 ? true : false;
            if (isValid) {
                let userData = data[0]
                let isMatch = await bcrypt.compare(params.password, userData.password)
                if (isMatch) {
                    let jwtToken = jwt.sign({
                        time: Date(),
                        userId: params.name,
                    }, jwtKey, { expiresIn: '3h' });

                    response = { status: true, 'jwtToken': jwtToken, 'data': userData }
                } else {
                    response = { status: false, statusCode: 1 }
                }

            } else {
                response = { status: false, statusCode: 2 }
            }
        }

        console.log("------login------", JSON.stringify(response));
        return res.json(response)
    },

    async usersRegistration(req, res) {

        let params = req.body;
        console.log("===>>params<<<<<", params);
        let response = { status: false, statusCode: -1 };
        if (params.name && params.name.trim() != "" && params.password && params.password.trim() != "" && params.email && params.email.trim() != "" && params.gender && params.gender.trim() != "" && params.age && params.age.trim() != "" && params.dateOfBirth && params.dateOfBirth.trim() != "") {

            let data = await models['users'].findAll({
                where: {
                    [Op.or]: [
                        { 'email': params.email },
                    ]
                },
                attributes: ['name', 'email',]
            });
            let isExist = data.length > 0 ? true : false;
            if (!isExist) {
                let encryptPassword = await bcrypt.hash(params.password, saltRounds);
                let createObj = {
                    'user_id': uuid(),
                    'name': params.name,
                    'email': params.email,
                    'password': encryptPassword,
                    'age': Math.floor(Math.random() * 100),
                    'gender': params.gender,
                    'dob': params.dateOfBirth
                }
                if (params.file != undefined) {
                    let fileName = params.file;
                    let basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                    createObj.image = `${basePath}${fileName}`;
                }

                await models['users'].create(createObj)
                response = { status: true }
            } else {
                response = { status: false, statusCode: 1 }
            }
        }
        return res.json(response)
    },

    async editUserDetails(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 };
        console.log("===>", params.age);
        if (params.name && params.name.trim() != "" && params.email && params.email.trim() != "" && params.userId && params.userId.trim() != ''
            && params.gender && params.gender.trim() != '' && params.age && params.dateOfBirth && params.dateOfBirth.trim() != "") {

            let userData = await models['users'].findAll({
                where: {
                    'user_id': params.userId
                },
            });
            if (userData.length > 0) {
                let updateObj = {
                    'age': params.age,
                    'gender': params.gender,
                    'email': params.email,
                    'name': params.name,
                    'dob': params.dateOfBirth
                }
                if (params.file != undefined) {
                    let fileName = params.file;
                    let basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                    updateObj.image = `${basePath}${fileName}`;
                }
                await models['users'].update(
                    updateObj, {
                    where: {
                        'user_id': params.userId
                    }
                }).then(() => {
                    response = { status: true, data: updateObj };
                }).catch((error) => {
                    console.log("===>> error:::", error)
                    response = { 'status': false, 'statusCode': 0 };
                });
            } else {
                response = { 'status': false, 'statusCode': 1 };
            }


        }
        return res.json(response)

    },

    async createEvent(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }

        if (params.eventName && params.eventName.trim() != '' && params.eventAddress && params.eventAddress.trim() != '' && params.userId && params.userId.trim() != '' && params.userName && params.userName.trim() != '' && params.userEmail && params.userEmail.trim() != '') {

            let eventId = uuid();
            await models['evetns'].create({
                event_id: eventId,
                name: params.eventName,
                place: params.eventAddress,
                created_by: params.userName,
                email: params.userEmail,
                user_id: params.userId
            }).then(() => {
                models['participants'].create({
                    participant_id: params.userId,
                    event_id: eventId,
                    e_name: params.eventName,
                    e_place: params.eventAddress,
                    u_name: params.userName,
                    u_email: params.userEmail,
                });
                response = { status: true }
            });
        }
        return res.json(response)
    },

    async joinEvent(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }

        if (params.eventId && params.eventId.trim() != '' && params.eventName && params.eventName.trim() != '' && params.eventAddress && params.eventAddress.trim() != '' && params.userId && params.userId.trim() != '' && params.userName && params.userName.trim() != '' && params.userEmail && params.userEmail.trim() != '') {

            let isAllReadyJoined = await models['participants'].findAll({
                where:{
                    participant_id: params.userId,
                    event_id: params.eventId,
                }
            });
            console.log("====isAllReadyJoined:::", JSON.stringify(isAllReadyJoined));
            if (isAllReadyJoined.length == 0) {
                await models['participants'].create({
                    participant_id: params.userId,
                    event_id: params.eventId,
                    e_name: params.eventName,
                    e_place: params.eventAddress,
                    u_name: params.userName,
                    u_email: params.userEmail,
                });
                response = { status: true }
            } else {
                response = { status: false, statusCode: 1 }
            }
        }
        return res.json(response)
    },

    async getJoinedEvents(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }

        if (params.userId && params.userId.trim() != '') {

            let isAllReadyJoined = await models['participants'].findAll({
                where:{
                    participant_id: params.userId,
                }
            });
            response = { status: true, data:isAllReadyJoined }
        }
        return res.json(response)
    },

    async getparticipants(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }

        if (params.eventId && params.eventId.trim() != '') {

            let participants = await models['participants'].findAll({
                where:{
                    event_id: params.eventId,
                },
                attributes:[['u_name','userName'],['u_email','userEmail']]
            });
            response = { status: true, data:participants }
        }
        return res.json(response)
    },

    async leaveJoinedEvents(req, res) {
        let params = req.body;
        let response = { status: false, statusCode: -1 }

        if (params.userId && params.userId.trim() != '' && params.eventId && params.eventId.trim() != '') {

            await models['participants'].destroy({
                where:{
                    participant_id: params.userId,
                    event_id:params.eventId
                }
            });
            response = { status: true }
        }
        return res.json(response)
    },

    async getEvents(req, res) {
        let params = req.body;
        if (params.limit != undefined && Number.isInteger(params.limit) && params.limit > 0 && params.offset != undefined && Number.isInteger(params.offset) && params.offset >= 0) {

        }
        let events = await models['evetns'].findAll({
            offset: params.offset,
            limit: params.limit,
        });
        let dataCount = await models['evetns'].count({});
        response = { status: true, data: events,totalCount:dataCount }
        return res.json(response)
    },

}