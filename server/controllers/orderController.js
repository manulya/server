const db = require("../db.js");
const ApiError = require("../error/ApiError.js");

class OrderController {
  async create(req, res,next) {
    const { userid, pictureid, address } = req.body;
    console.log(req.body)
    const candidate = await db.query(
      `select * from public."Order" where userid=$1 and pictureid=$2`,
      [userid, pictureid]
    );
    if (candidate.rowCount) {
      return next(
        ApiError.badRequest("Заявка этим пользователем на эту картину уже была")
      );
    }
    const newOrder= await db.query(
      `INSERT INTO public."Order"(
        userid, pictureid, address)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userid, pictureid, address]
    );
    res.json(newOrder.rows[0]);
  }
  async getAll(req, res) {
    let {userid} = req.query;
    let orders
    if(userid){
     orders = await db.query(
      `
      select * from public."Order"
      where userid=$1`,
      [userid]
    );
     }
    else{
      orders = await db.query(
        `
        
	select public."Order".id, userid,pictureid,name, address from public."Order" join public.user on public.user.id="Order".userid`
      );
    }
    
    res.json(orders.rows);
  }
  
}

module.exports = new OrderController();
