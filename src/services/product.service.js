const ProductManager = require('../../mongo/ProductManager');
const productManager = new ProductManager();

module.exports = {
    getProducts: productManager.getProducts,
    getProductById: productManager.getProductById,
    addProduct: productManager.addProduct,
    updateProduct: productManager.updateProduct,
    deleteProduct: productManager.deleteProduct,
};