const request = require('request-promise-native');
const _ = require('lodash');

const getExchangeRate = async (from, to) => {
  try {
    const response = await request.get({
      baseUrl                : 'http://data.fixer.io/api/',
      url                    : `/latest?base=${from}&access_key=94c39c856bfba67e77aeda91b0f9856c`,
      resolveWithFullResponse: true,
      json                   : true
    });
    const rate = _.get(response, `body.rates[${to}]`, '');

    if (rate) {
      return rate;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}`);
  }
};

const getCountries = (currencyCode) => {
  try {
    const response = request.get({
      baseUrl                : 'http://restcountries.eu',
      url                    : `/rest/v2/currency/${currencyCode}`,
      resolveWithFullResponse: true,
      json                   : true
    });

    return response.body.map(country => country.name);
  } catch (error) {
    throw new Error(`Enable to get countries that use ${currencyCode}`);
  }
};

const convertCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to);
  const countries = await getCountries(to);

  const exchangedAmount = amount * rate;

  return `${amount} ${from} is worth ${exchangedAmount} ${to}.
   ${to} can be used in the following countries: ${countries}`;
};

const getCurrency = (req, res) => {
  const {
    from,
    to,
    amount
  } = req.query;

  convertCurrency(from, to, amount)
    .then(text => res.json({ text }))
    .catch(error => {
      res.status(404).json({ error: error.message })
    });
};

module.exports = {
  getCurrency
};
