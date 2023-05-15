const db = require("../db.js");
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        console.log(req.body)
        const {name} = req.body
        const type = await db.query(
            `INSERT INTO public.type(name) VALUES ($1) RETURNING *`, [name]);
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await db.query(`SELECT * FROM public.type`);
        return res.json(types.rows)
    }

}

module.exports = new TypeController()
