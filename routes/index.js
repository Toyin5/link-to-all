const express = require('express');
const linkRouter = express.Router();
const authModule = require('./authRoute');
const profileModule = require('./profileRoute');

linkRouter.use('/auth', authModule.authRoute);
linkRouter.use('/profile', profileModule.profileRoute);

module.exports = linkRouter;
