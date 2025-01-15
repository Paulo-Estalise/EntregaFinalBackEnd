class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async findAll() {
      return this.dao.findAll();
    }
  
    async findById(id) {
      return this.dao.findById(id);
    }
  }
  
  module.exports = ProductRepository;