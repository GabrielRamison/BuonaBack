// src/controllers/WineryController.js
const knex = require('../database');

class WineryController {
  async index(req, res) {
    try {
      const wineries = await knex('wineries')
        .select('*')
        .where('is_active', true);

      return res.json(wineries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar vinícolas' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const winery = await knex('wineries')
        .where({ id, is_active: true })
        .first();

      if (!winery) {
        return res.status(404).json({ error: 'Vinícola não encontrada' });
      }

      return res.json(winery);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar vinícola' });
    }
  }

  async store(req, res) {
    try {
      const {
        name,
        description,
        address,
        city,
        state,
        postal_code,
        latitude,
        longitude,
        phone,
        email,
        website,
        business_hours
      } = req.body;

      const [id] = await knex('wineries').insert({
        name,
        description,
        address,
        city,
        state,
        postal_code,
        latitude,
        longitude,
        phone,
        email,
        website,
        business_hours: JSON.stringify(business_hours),
        is_active: true,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });

      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar vinícola' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.business_hours) {
        updateData.business_hours = JSON.stringify(updateData.business_hours);
      }

      await knex('wineries')
        .where({ id })
        .update({
          ...updateData,
          updated_at: knex.fn.now()
        });

      return res.json({ message: 'Vinícola atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar vinícola' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await knex('wineries')
        .where({ id })
        .update({ 
          is_active: false,
          updated_at: knex.fn.now()
        });

      return res.json({ message: 'Vinícola desativada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao desativar vinícola' });
    }
  }
}

module.exports = new WineryController();