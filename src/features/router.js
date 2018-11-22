const express = require('express');
const usersRoutes = require('./users/router');
const toDosRoutes = require('./toDos/router');
const currencyRoutes = require('./currency/router');
const booksRoutes = require('./sqlBooks/router');

const router = express.Router();

router.use(usersRoutes);
router.use(toDosRoutes);
router.use(currencyRoutes);
router.use(booksRoutes);

module.exports = router;
