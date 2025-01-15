function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
  
  function isUser(req, res, next) {
    if (req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
  
  module.exports = { isAdmin, isUser };