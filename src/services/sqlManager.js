const fs = require('fs');
const path = require('path');

const sqlQueries = {};

module.exports = {
  getSql(sourceDir, sqlName) {
    const sqlPath = path.resolve(sourceDir, 'sql', `${sqlName}.sql`);

    if (sqlQueries[sqlPath]) {
      return sqlQueries[sqlPath];
    }

    if (!fs.fileExistsSync(sqlPath)) {
      return new Error(`Target sql "${sqlName}.sql" not found in folder "${path.resolve(sourceDir, 'sql')}"`);
    }

    const query = `${fs.readFileSync(sqlPath)}`;

    // cache query for future use
    sqlQueries[sqlPath] = query;

    return query;
  }
};
