const express = require('express');
const controller = require('../controllers');

const authRoute = express.Router();

authRoute.post('/reg', controller.AuthController.usersignup);

module.exports = {
    authRoute,
}