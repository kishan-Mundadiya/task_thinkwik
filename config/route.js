const express = require('express');
const router = express.Router();
const middleware = require('../services/middleware')
const multer = require('multer');


const TestController = require('../controllers/TestController');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('.').join('-');
        req.fileName = fileName;
        console.log("==>>>filename",file);
        console.log("==>>>filename11",fileName);
        const extension = FILE_TYPE_MAP[file.mimetype];
        req.body.file = `${fileName}-${Date.now()}.${extension}`
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = multer({ storage: storage });


router.post('/signin', middleware, TestController.login);
router.post('/signup',uploadOptions.single('image'), TestController.usersRegistration);
router.post('/user/edit',uploadOptions.single('image'), TestController.editUserDetails);

router.post('/event/create', middleware, TestController.createEvent);
router.post('/event/get', middleware, TestController.getEvents);

router.post('/event/join', middleware, TestController.joinEvent);
router.post('/event/join/get', middleware, TestController.getJoinedEvents);
router.post('/event/join/leave', middleware, TestController.leaveJoinedEvents);
router.post('/event/participant/get', middleware, TestController.getparticipants);

module.exports = router;