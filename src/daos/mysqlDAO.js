const mysql = require('mysql2/promise');
const config = require('../config/config');

class MySQLDAO {
  constructor() {
    this.pool = mysql.createPool({
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async findAll(table) {
    const [rows] = await this.pool.query(`SELECT * FROM ${table}`);
    return rows;
  }

  async findById(table, id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM ${table} WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async create(table, data) {
    const [result] = await this.pool.query(`INSERT INTO ${table} SET ?`, data);
    return { id: result.insertId, ...data };
  }

  async update(table, id, data) {
    await this.pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
    return this.findById(table, id);
  }

  async delete(table, id) {
    await this.pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return true;
  }
}

module.exports = MySQLDAO;