const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV;
const workingDirectory = path.join(__dirname, '../');
const envPath = path.join(__dirname, `.env${env ? `.${env}` : ''}`).normalize();

console.log('env path:', envPath);
// loads environment variables from a .env file into process.env
dotenv.config({ path: envPath });

const common = require('./components/common/index');
const extra = { workingDirectory };

const config = {
  ...common,
  ...extra
};

module.exports = config;
