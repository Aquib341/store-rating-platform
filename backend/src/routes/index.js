const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

// Define your routes here
router.get('/example', controller.exampleFunction);

module.exports = router;