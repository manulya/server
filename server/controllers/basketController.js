const db = require("../db.js");
const ApiError = require("../error/ApiError.js");

class BasketController {
  async create(req, res, next) {
    const { userid, pictureid } = req.body;

    const candidate = await db.query(
      `select * from public.basket where userid=$1 and pictureid=$2`,
      [userid, pictureid]
    );
    if (candidate.rowCount) {
      return next(
        ApiError.badRequest(
          "Картина уже была добавлена в корзину"
        )
      );
    }
    
    const newBasketItem = await db.query(
      `INSERT INTO public.basket(userid, pictureid) VALUES ($1, $2) RETURNING *`,
      [userid, pictureid]
    );
    res.json(newBasketItem.rows[0]);
  }

  async getAll(req, res) {
    const userid = req.params.userId;
    const basketItems = await db.query(
      `
      select * from public.basket where userid=$1`,
      [userid]
    );
    res.json(basketItems.rows);
  }
  async delete(req, res) {
    const id = req.params.id;
    const item = await db.query(`DELETE FROM public.basket where id =$1`, [
      id,
    ]);
    res.json(item.rows[0]);
  }
}

module.exports = new BasketController();