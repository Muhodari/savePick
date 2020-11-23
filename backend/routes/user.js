const express = require('express');
const userController = require('../controllers/user')

const router = express();

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin)

module.exports = router;