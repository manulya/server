const db = require("../db.js");
const uuid = require('uuid')
const path = require('path');
const ApiError = require('../error/ApiError.js');

class PictureController {
    async create(req, res, next) {
        try {
            const {name, price, brandid, typeid} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const picture = await db.query(
                `INSERT INTO public.picture(
                    name, price, brandid, typeid, img)
                  VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                  [name, price, brandid, typeid, fileName]);

            return res.json(picture.rows[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let pictures;
        if (!brandId && !typeId) {
            pictures = await db.query('SELECT * FROM public.picture LIMIT $1 OFFSET $2', [limit, offset]);
        }
        if (brandId && !typeId) {
            pictures = await db.query('SELECT * FROM public.picture WHERE brandid=$1 LIMIT $2 OFFSET $3', [brandId, limit, offset]);
        }
        if (!brandId && typeId) {
            pictures = await db.query('SELECT * FROM public.picture WHERE typeid=$1 LIMIT $2 OFFSET $3', [typeId, limit, offset]);
        }
        if (brandId && typeId) {
            pictures = await db.query('SELECT * FROM public.picture WHERE typeid=$1 AND brandid=$2 LIMIT $3 OFFSET $4', [typeId, brandId, limit, offset]);
        }
        return res.json({pictures:pictures.rows, found:pictures.rows.length>0})
    }

    async getOne(req, res) {
        const id = req.query
        const picture = await db.query(`SELECT * FROM public.picture where id=$1`,[id])
        return res.json(picture.rows[0])
    }
}

module.exports = new PictureController()
