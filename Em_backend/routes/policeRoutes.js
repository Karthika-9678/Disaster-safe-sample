const express = require('express');
const router = express.Router();
const { getNearestPoliceStation } = require('../controllers/policeController');

router.post('/nearest-police', getNearestPoliceStation);

module.exports = router;
