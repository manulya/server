const db = require("../db.js");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError.js");

class PictureController {
  async create(req, res, next) {
    try {
      const { name, price, brandid, typeid } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const picture = await db.query(
        `INSERT INTO public.picture(
                    name, price, brandid, typeid, img)
                  VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, price, brandid, typeid, fileName]
      );

      return res.json(picture.rows[0]);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
   
    let { name, typeId, brandId, sortOrder } = req.query;
    const queryOptions = {
      name: name && !typeId && !(!!brandId),
      typeId: !name && typeId && !(!!brandId),
      brandId: !name && !typeId && !!brandId,
      nameAndType: name && typeId && !(!!brandId),
      nameAndBrand: name && !typeId && !!brandId,
      typeAndBrand: !name && typeId && !!brandId,
      default: !name && !typeId && !(!!brandId),
    };

    let pictures;
    
    switch (true) {
      case queryOptions.name:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where name=$1 order by price desc`,
            [name]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where name=$1 order by price`,
            [name]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where name=$1`,
            [name]
          );
        break;
      case queryOptions.brandId:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 order by price desc`,
            [brandId]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 order by price`,
            [brandId]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where brandid=$1`,
            [brandId]
          );
        break;
        
      case queryOptions.typeId:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where typeid=$1 order by price desc`,
            [typeId]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where typeid=$1 order by price`,
            [typeId]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where typeid=$1`,
            [typeId]
          );
        break;
      case queryOptions.nameAndType:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where typeid=$1 and name=$2 order by price desc`,
            [typeId, name]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where typeid=$1 and name=$2 order by price`,
            [typeId, name]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where typeid=$1 and name=$2`,
            [typeId, name]
          );
        break;
      case queryOptions.nameAndBrand:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and name=$2 order by price desc`,
            [brandId, name]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and name=$2 order by price`,
            [brandId, name]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and name=$2`,
            [brandId, name]
          );
        break;
      case queryOptions.typeAndBrand:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and typeid=$2 order by price desc`,
            [brandId, typeId]
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and typeid=$2 order by price`,
            [brandId, typeId]
          );
        } else
          pictures = await db.query(
            `select * from public.picture where brandid=$1 and typeid=$2`,
            [brandId, typeId]
          );
        break;
      case queryOptions.default:
        if (sortOrder === "cd") {
          pictures = await db.query(
            `select * from public.picture order by price desc`
          );
        } else if (sortOrder === "cu") {
          pictures = await db.query(
            `select * from public.picture order by price`
          );
        } else pictures = await db.query(`select * from public.picture`);
        break;
    }
   
    return res.json({
      pictures: pictures.rows,
      found: pictures.rows.length > 0,
    });
  }
  async update(req, res) {
    const { id, price } = req.body;
    const picture = await db.query(
      `UPDATE public.picture set price=$1 where id =$2 RETURNING*`,
      [price,id]
    );
    res.json(picture.rows[0]);
  }
  async delete(req, res) {
    const id = req.params.id;
    
    const picture = await db.query(`DELETE FROM public.picture where id =$1`, [
      id
    ]);
    res.json(picture.rows[0]);
  }
}

module.exports = new PictureController();
