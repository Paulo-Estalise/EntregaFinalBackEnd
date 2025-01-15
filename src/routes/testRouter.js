const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/loggerTest', (req, res) => {
  logger.debug('Este é um log de debug');
  logger.http('Este é um log de http');
  logger.info('Este é um log de info');
  logger.warn('Este é um log de warning');
  logger.error('Este é um log de error');
  logger.fatal('Este é um log de fatal');

  res.status(200).json({ message: 'Logs testados com sucesso!' });
});

module.exports = router;