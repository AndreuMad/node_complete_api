/**
 * Create promise for listen
 * @param serverInstance http src instance
 * @param options object with port, host, path, backlog, exclusive fields for src instance options
 * @returns {Promise}
 */
module.exports = (serverInstance, options) => new Promise((resolve, reject) => {
  serverInstance.listen(options, err => {
    if (err) {
      reject(err);
    } else {
      resolve(serverInstance);
    }
  });
});
