const db = require("../db.js");
const ApiError = require("../error/ApiError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, name, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный логин или пароль"));
    }
    const candidate = await db.query(`select * from public.user where email=$1`,
      [email]
    );
    if (candidate.rowCount) {
      return next(
        ApiError.badRequest("Пользователь с таким логином уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = await db.query(
      `INSERT INTO public.user(
            role, name, password, email)
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [role, name, hashPassword, email]
    );
    const token = generateJwt(newUser.rows[0].id, newUser.rows[0].email, newUser.rows[0].role);

    return res.json({ token });
  }
  
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await db.query(`select * from public.user where email=$1`, [
      email,
    ]);
    if (!user.rowCount) {
      return next(
        ApiError.internal("Пользователь с таким логином не существует")
      );
    }
    let comparePassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!comparePassword) {
      return next(ApiError.internal("указан неверный пароль"));
    }
    const token = generateJwt(user.rows[0].id, user.rows[0].email, user.rows[0].role);
    return res.json({ token });
  }

  async check(req, res, next) {
        const token= generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
  }
}

module.exports = new UserController();
