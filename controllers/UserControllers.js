const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { User, Key, Matrix_Table, Matrix, InvestBox } = require("../models/models");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");

const generateJwt = (id, email, username, first_name, last_name, referral) => {
  return jwt.sign(
    {
      id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      referral: referral,
      username: username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

async function highCheck(level, user, idCreateUser) {
  const parent = await User.findOne({ where: { id: user.referal_id } });
  const parentSecond =
    parent.id === parent.referal_id
      ? parent
      : await User.findOne({ where: { id: parent.referal_id } });
  const parentThird =
    parentSecond.id === parentSecond.referal_id
      ? parentSecond
      : await User.findOne({
        where: { id: parentSecond.referal_id },
      });
  let bool = false;

  switch (level) {
    case "1":
      if (user.referal_id === idCreateUser) {
        bool = true;
      }
      break;
    case "2":
      if (parent.referal_id === idCreateUser) {
        bool = true;
      }
      break;
    case "3":
      if (parentSecond.referal_id === idCreateUser) {
        bool = true;
      }
      break;
    case "4":
      if (parentThird.referal_id === idCreateUser) {
        bool = true;
      }
      break;
  }
  return bool;
}

class UserController {
  async registration(req, res, next) {
    const {
      email,
      first_name,
      last_name,
      password,
      phone,
      referral,
      username,
    } = req.body;

    if (
      !email ||
      !password ||
      !last_name ||
      !first_name ||
      !phone ||
      !referral ||
      !username
    ) {
      return next(ApiError.badRequest("Не все поля заполнены"));
    }
    const candidate =
      (await User.findOne({ where: { email } || { username } })) || null;
    if (candidate) {
      return next(ApiError.badRequest("Такой пользователь уже существует"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const referralUser = await User.findOne({ where: { username: referral } });
    if (!referralUser) {
      return next(ApiError.badRequest("Такой пользователь не существует"));
    }
    const user = await User.create({
      email,
      username,
      first_name,
      last_name,
      password: hashPassword,
      phone,
      referal_id: referralUser.id,
      activation_date: new Date()
    });
    const access_token = generateJwt(
      user.id,
      user.email,
      user.username,
      user.first_name,
      user.last_name,
      user.referral
    );
    return res.json({ access_token });
  }

  async login(req, res, next) {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return next(ApiError.internal("Такой пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    const access_token = generateJwt(
      user.id,
      user.email,
      user.username,
      user.first_name,
      user.last_name,
      user.referral 
    );
    const w = user.id;
    return res.json({ access_token, w });
  }
  async inviter(req, res, next) {
    const { username } = req.query;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return next(ApiError.internal("Такой пользователь не найден"));
    }
    let result = {
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    };
    return res.json(result);
  }
  async user(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    try {
      const { username } = jwt_decode(token);
      let user = await User.findOne({ where: { username } });
      if (!user) {
        return next(ApiError.internal("Такой пользователь не найден"));
      }
      let now = new Date();
      let { activation_date, balance } = user
      let limit = new Date(activation_date?.getFullYear(), (activation_date?.getMonth() + 1), activation_date?.getDate())
      if (now > limit) {
        let update = { balance: balance - 1000 };
        await User.update(update, { where: { id: user.id } });

      }

      const investItem = await InvestBox.findAll({ where: { userId: user.id } })
      investItem.map(async (item) => {
        let depozitTime = item.updatedAt;
        let limitInvest = new Date(depozitTime?.getFullYear(), (depozitTime?.getMonth() + 1), depozitTime?.getDate())
        if (now > limitInvest) {
          let countMonth = Math.floor(now?.getMonth() - depozitTime?.getMonth())
          let update = { summ: (countMonth * (0.05 * item.summ) + item.summ), updatedAt:new Date(depozitTime?.getFullYear(), (depozitTime?.getMonth() + countMonth), depozitTime?.getDate() ) };
          await InvestBox.update(update, { where: { id: item.id } })
        }
      })

      user = await User.findOne({ where: { username } });
      const matrixUser = await Matrix_Table.findAll({
        where: { userId: user.id },
      });
      let allBalances = (+user.balance)
      let referal = await User.findOne({ where: { id: user.referal_id } });
      let balanceCrypto = await BalanceCrypto.findAll({where:{userId:user.id}, include:{model: Wallet, as:'wallet'}})
      user.dataValues.referal = referal;
      user.dataValues.balanceCrypto = {};
      
      for (let i = 0; i < balanceCrypto.length; i++) {
        const market  = await Market.findOne({where:{pair:`RUR_${balanceCrypto[i].wallet.name}`}})
        const orderSell = await OrderSell.findOne({where:{marketId:market.id}})
        allBalances += balanceCrypto[i].balance * orderSell.price
        user.dataValues.balanceCrypto[`${balanceCrypto[i].wallet.name}`] = balanceCrypto[i].balance.toFixed(8)
        user.dataValues.allBalances = allBalances
      }
      return res.json(user);
    } catch (error) {
      console.log(error);
      return next(ApiError.internal(error));
    }
  }

  async avatar(req, res, next) {
    const { avatar } = req.files;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    let fileName = uuid.v4() + ".jpg";
    avatar.mv(path.resolve(__dirname, "..", "files", "images", fileName));
    let update = { avatar: fileName };
    await User.update(update, { where: { id: user.id } });
    return res.json("Аватар успешно загружен");
  }

  async fio(req, res, next) {
    const { firstName, lastName } = req.body;
    if (!firstName && !lastName) {
      return next(ApiError.internal("Поля не заполнены"));
    }
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    let update = {}
    if (!firstName && lastName) {
      update = { last_name: lastName };
    } else if (firstName && !lastName) {
      update = { first_name: firstName };
    } else {
      update = { last_name: lastName, first_name: firstName };
    }
    const updatedUser = await User.update(update, { where: { id: user.id } });
    return res.json(updatedUser)
  }
  async links(req, res, next) {
    const { instagram, telegram, vk } = req.body;
    if (!instagram && !telegram && !vk) {
      return next(ApiError.internal("Поля не заполнены"));
    }
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    let update = {}
    if (!instagram && !telegram && vk) {
      update = { vkontakte: vk }
    } else if (!instagram && telegram && !vk) {
      update = { telegram }
    } else if (instagram && !telegram && !vk) {
      update = { instagram }
    } else if (instagram && telegram && !vk) {
      update = { instagram, telegram }
    } else if (instagram && !telegram && vk) {
      update = { instagram, vkontakte: vk }
    } else if (!instagram && telegram && vk) {
      update = { telegram, vkontakte: vk }
    } else {
      update = { telegram, instagram, vkontakte: vk }
    }
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const updatedUser = await User.update(update, { where: { id: user.id } });
    return res.json(updatedUser)
  }

  async description(req, res, next) {
    const { description } = req.body;
    if (!description) {
      return next(ApiError.internal("Поля не заполнены"));
    }
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    let update = { description }
    const updatedUser = await User.update(update, { where: { id: user.id } });
    return res.json(updatedUser)
  }

}

module.exports = new UserController();
