const helpers = require('../helpers');

const getCurrency = (req, res) => {
  const {
    from,
    to,
    amount
  } = req.query;

  helpers.convertCurrency(from, to, amount)
    .then(text => res.json({ text }))
    .catch(error => {
      res.status(404).json({ error: error.message })
    });
};

module.exports = {
  getCurrency
};
