// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('=== Verificando Autenticação ===');
    console.log('Headers recebidos:', req.headers);
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Header de autorização não encontrado');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token encontrado:', token ? 'Sim' : 'Não');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', {
      userId: decoded.id,
      userEmail: decoded.email,
      userRole: decoded.role,
      isAdmin: decoded.role === 'admin'
    });

    req.userData = decoded;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};