const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('USER_NOT_FOUND'); // Erro personalizado
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_PASSWORD'); // Erro personalizado
    }

    return user;
  }

  async register(userData) {
    const { email, password } = userData;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('USER_ALREADY_EXISTS'); // Erro personalizado
    }

    // Criptografa a senha
    const hashedPassword = bcrypt.hashSync(password, 10);
    userData.password = hashedPassword;

    // Cria o usuário
    const user = new User(userData);
    await user.save();

    return user;
  }
}

module.exports = AuthService;