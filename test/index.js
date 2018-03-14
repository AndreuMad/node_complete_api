require('use-strict');
const chai = require('chai');
const sinon = require('sinon');
const bluebird = require('bluebird');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

const { server } = require('../server/server');

chai.use(sinonChai);
chai.use(chaiAsPromised);

beforeEach(function beforeEachHook() {
  this.sandbox = sinon.sandbox.create();
  this.sandbox.usingPromise(bluebird.Promise);
});

after(function afterHook() {
  // Tip: clear database after tests etc.
  // process.exit();
});

afterEach(function afterEachHook() {
  server.close();
  this.sandbox.restore();
});
