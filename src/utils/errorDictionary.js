const errorDictionary = {
    PRODUCT_NOT_FOUND: {
      code: 404,
      message: 'Produto não encontrado.',
    },
    INVALID_PRODUCT_DATA: {
      code: 400,
      message: 'Dados do produto inválidos.',
    },
    CART_NOT_FOUND: {
      code: 404,
      message: 'Carrinho não encontrado.',
    },
    INSUFFICIENT_STOCK: {
      code: 400,
      message: 'Estoque insuficiente para o produto.',
    },
    UNAUTHORIZED_ACCESS: {
      code: 403,
      message: 'Acesso não autorizado.',
    },
    INTERNAL_SERVER_ERROR: {
      code: 500,
      message: 'Erro interno no servidor.',
    },
  };
  
  module.exports = errorDictionary;
  