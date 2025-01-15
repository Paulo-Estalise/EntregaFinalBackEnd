const errorDictionary = require('../utils/errorDictionary');

function errorHandler(err, req, res, next) {
  // Verifica se o erro está no dicionário
  const error = errorDictionary[err.message] || {
    code: 500,
    message: 'Erro interno no servidor.',
  };

  // Log do erro no console (para depuração)
  console.error(err);

  // Resposta ao cliente
  res.status(error.code).json({
    success: false,
    message: error.message,
    error: err.message, // Opcional: enviar o erro original
  });
}

module.exports = errorHandler;