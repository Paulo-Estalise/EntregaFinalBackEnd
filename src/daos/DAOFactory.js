const MongoDAO = require('./mongoDAO');
const MySQLDAO = require('./mysqlDAO');

class DAOFactory {
  static getDAO(type) {
    switch (type) {
      case 'mongo':
        return new MongoDAO();
      case 'mysql':
        return new MySQLDAO();
      default:
        throw new Error('DAO type not supported');
    }
  }
}

module.exports = DAOFactory;