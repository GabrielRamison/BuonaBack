// src/middlewares/admin.js
const isAdmin = (req, res, next) => {
    try {
      // req.userData já foi definido pelo middleware de auth
      if (req.userData.role !== 'admin') {
        console.log('Acesso negado - usuário não é admin:', {
          userId: req.userData.id,
          userRole: req.userData.role
        });
        return res.status(403).json({ 
          error: 'Acesso negado - permissões insuficientes' 
        });
      }
      
      console.log('Acesso admin autorizado:', {
        userId: req.userData.id,
        userEmail: req.userData.email
      });
      next();
    } catch (error) {
      console.error('Erro na verificação de admin:', error);
      return res.status(500).json({ error: 'Erro na verificação de permissões' });
    }
  };
  
  module.exports = isAdmin;