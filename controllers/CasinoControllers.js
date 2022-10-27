const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

const {
    InvestBox,
    User
} = require("../models/models");


class CasinoControllers {

    async admin(req, res, next) {

        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findAll({
            where: { username: decodeToken.username },
        });
        const investItem = await InvestBox.findOne({
            where:{userId: user.Id}
        })

        return res.json(investItem)

    }

}


module.exports = new CasinoControllers();