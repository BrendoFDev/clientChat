const express = require('express');
const router = express.Router();

const homeController = require('./src/api/controller/homeController');

router.get('/login', homeController.getLogin);
router.get('/index', homeController.getIndex);
router.get('/caduser', homeController.getCadUser);
module.exports = router;