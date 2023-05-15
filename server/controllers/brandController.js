const db = require("../db.js");
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res) {
        console.log(req.body)
        const {name} = req.body
        const brand = await db.query(
            `INSERT INTO public.brand(name) VALUES ($1) RETURNING *`, [name]);
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await db.query(`SELECT * FROM public.brand`);
        return res.json(brands.rows)
    }

}

module.exports = new BrandController()
