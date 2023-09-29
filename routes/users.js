const express = require('express');
const { getAllUsers, getUser, createUser } = require('../controllers/users');

const router = express.Router();

const cors = require('cors');
router.use(cors());

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults('Users'), getAllUsers).post(createUser);
router.route('/:id').get(getUser);

module.exports = router;
