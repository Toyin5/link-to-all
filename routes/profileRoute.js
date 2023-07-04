const express = require('express');
const controllers = require('../controllers');

const profileRoute = express.Router();

profileRoute.get('/:username', controllers.ProfileController.userprofile)


module.exports = {
  profileRoute,
}
