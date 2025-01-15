const { faker } = require('@faker-js/faker'); 

class MockingModule {
  static generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        _id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        stock: faker.datatype.number({ min: 0, max: 100 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }
    return products;
  }
}

module.exports = MockingModule;