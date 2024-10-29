// src/controllers/WineController.js
const knex = require('../database');

class WineController {
  async index(req, res) {
    try {
      const wines = await knex('wines').select('*');
      return res.json(wines);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar vinhos' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const wine = await knex('wines').where({ id }).first();

      if (!wine) {
        return res.status(404).json({ error: 'Vinho não encontrado' });
      }

      return res.json(wine);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar vinho' });
    }
  }

  async store(req, res) {
    try {
      const { name, description, price, stock, winery_id } = req.body;

      const [id] = await knex('wines').insert({
        name,
        description,
        price,
        stock,
        winery_id
      });

      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar vinho' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      await knex('wines').where({ id }).update(updateData);

      return res.json({ message: 'Vinho atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar vinho' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await knex('wines').where({ id }).del();
      return res.json({ message: 'Vinho removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover vinho' });
    }
  }
}

module.exports = new WineController();