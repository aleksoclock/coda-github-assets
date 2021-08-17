const express = require('express');
const mainController = require('./controller');
const router = express.Router();

router.get('/oclock-apo/coda/create-assets/github', mainController.generateGithubAssets);

module.exports = router;