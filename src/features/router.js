const express = require('express');
const usersRoutes = require('./users/router');
const toDosRoutes = require('./toDos/router');
const currencyRoutes = require('./currency/router');

const router = express.Router();

router.use(usersRoutes);
router.use(toDosRoutes);
router.use(currencyRoutes);

module.exports = router;
