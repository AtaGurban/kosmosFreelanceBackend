const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

const {
    InvestBox,
    User
} = require("../models/models");


class InvestControllers {

    async create(req, res, next) {

        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const {amount} = req.body
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        if (user.balance < amount){
            return next(ApiError.internal("Не хватает средств!"));
        }
        let update = {balance: user.balance - amount}
        await User.update(update, {where:{id:user.id}})
        const status = 'активный'
        const investItem = await InvestBox.create({
            status,
            summ: amount,
            userId: user.id
        })

        return res.json(true)
    }

}


module.exports = new InvestControllers();