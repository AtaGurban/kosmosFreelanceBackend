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
        const status = 'активный'
        const investItem = await InvestBox.create({
            status,
            summ: amount,
            userId: user.id
        })
    }

}


module.exports = new InvestControllers();