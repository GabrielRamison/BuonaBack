
    // src/controllers/UserController.js
    // Funções relacionadas ao gerenciamento de usuário
    class UserController {
      async profile(req, res) {
        try {
          const { id } = req.userData;
    
          const user = await knex('users')
            .select('id', 'name', 'email', 'phone', 'role', 'profile_image')
            .where({ id, is_active: true })
            .first();
    
          if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }
    
          return res.json(user);
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          return res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
        }
      }
    
      async update(req, res) {
        try {
          const { id } = req.userData;
          const { 
            name, 
            phone, 
            currentPassword, 
            newPassword,
            profile_image 
          } = req.body;
    
          const user = await knex('users')
            .where({ id, is_active: true })
            .first();
    
          if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }
    
          const updateData = {};
    
          if (name) updateData.name = name;
          if (phone) updateData.phone = phone;
          if (profile_image) updateData.profile_image = profile_image;
    
          if (newPassword) {
            if (!currentPassword) {
              return res.status(400).json({ error: 'Senha atual é necessária' });
            }
    
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
              return res.status(401).json({ error: 'Senha atual incorreta' });
            }
    
            updateData.password = await bcrypt.hash(newPassword, 10);
          }
    
          await knex('users')
            .where({ id })
            .update(updateData);
    
          const updatedUser = await knex('users')
            .select('id', 'name', 'email', 'phone', 'role', 'profile_image')
            .where({ id })
            .first();
    
          return res.json(updatedUser);
        } catch (error) {
          console.error('Erro ao atualizar:', error);
          return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }

}