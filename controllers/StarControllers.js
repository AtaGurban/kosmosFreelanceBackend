const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const sequelize = require('../db')
const { Op, col } = require("sequelize");
const { where } = require("sequelize");


const {
    User,
    Matrix,
    Matrix_Table,
    Statistic
} = require("../models/models");

const updateOrCreate = async function (model, where, newItem) {
    // First try to find the record
    await model.findOne({ where: where }).then(function (foundItem) {
        (!foundItem) ?  ( model.create(newItem)) : (async()=>await model.update(newItem, { where: where }))
    })
}

const updateStatistic = async (all_comet, all_planet) => {
    let update = {all_comet, all_planet}

    const allItems = await Statistic.update( update, {where: { id: { [Op.not]: 0 } } })
}


const summColumnStatistic = async () => {
    let resp = await Matrix_Table.findAll({
        attributes: [[
            sequelize.fn("sum", sequelize.col(`count`)), "all_count",
        ]]
    })
    return resp
}

const checkForLevel = async (parentId, level) => {
    let countRows = await Matrix_Table.count({
        where: { matrixId: parentId, id: { [Op.not]: 1 }, typeMatrixId: level }
    })


    if (countRows < 3) {
        return false
    } else {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const mTable = await Matrix_Table.findAll()
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table[0]?.typeMatrixId === level + 1))
        })
        let parentIdForLevel
        if (matrix.length === 0) {
            parentIdForLevel = matrixTemp.length + 1
        } else {
            const matrixParentId = Math.ceil(matrix.length / 3)
            parentIdForLevel = matrix[matrixParentId - 1]?.id || null
        }

        const user = await Matrix.findOne({ id: parentId })
        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentIdForLevel,
            userId: user.userId
        })
        // let update = {
        //     matrixId: parentIdForLevel,
        //     typeMatrixId: level + 1,
        // }
        // console.log(update);


        const matrixTableCount = await Matrix_Table.findOne({
            where: { typeMatrixId: level, matrixId: parentId }
        })
        matrixTableCount.matrixId = parentIdForLevel;
        matrixTableCount.typeMatrixId = level + 1
        await matrixTableCount.save()
        // const matrixTableItem = await Matrix_Table.update(update, {
        //     where: { id: matrixTableCount + 1, } 
        // }) 
        // вознограждения
        // if (level + 1 > 5){
        //     let update
        //     switch (level + 1) {
        //         case 6:
        //             const userTwo = await User.findOne({where:{id:user.id}})
        //             break;

        //     }
        // }

        return checkForLevel(parentIdForLevel, level + 1)
    }

}


class StarControllers {

    async buy(req, res, next) {
        // const { limit, offset } = req.query;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        if (user.balance < 2000) {
            return next(ApiError.badRequest("Недостаточно средств"));
        }
        let update = { balance: `${((+ user.balance) - 2160)}.00000000` }

        let temp = await User.update(update, { where: { username: decodeToken.username } })

        const level = 1;


        // const matrixCheck = await Matrix.findOne({
        //     where:{userId:user.id}
        // })

        // if (matrixCheck){
        //     const matrixItem = await Matrix.create({
        //         date: new Date,
        //         parent_id: matrixCheck.parent_id,
        //         userId: user.id
        //     })
        //     const levelCheck = (await Matrix_Table.findOne({
        //         where:{userId:user.id}
        //     })).type_matrix_id
        //     const matrixTableItem = await Matrix_Table.create({
        //         matrix_parent_id: matrixCheck.parent_id,
        //         typeMatrixId:levelCheck,
        //         userId:user.id,
        //         count: 2000
        //     })
        //     return res.json(true);
        // }
        // const matrix = await sequelize.query(`SELECT distinct (parent_id), id FROM matrices`)
        // const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table.length === 0) || ((i.matrix_table[0]?.typeMatrixId === 1)))
        })
        const matrixTable = await Matrix_Table.count()

        // console.log('matrixTemp', matrixTemp);
        // console.log('matrix', matrix); 
        const matrixParentId = Math.ceil(matrixTable / 3)
        const parentId = (matrix[matrixParentId - 1]?.id) ? matrix[matrixParentId - 1]?.id : null
        // console.log(parentId);   
        // console.log(matrix);
        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentId,
            userId: user.id
        })
        const matrixTableItem = await Matrix_Table.create({
            matrixId: parentId,
            typeMatrixId: level,
            userId: user.id,
            count: 2160
        })

        const userItemsInMAtrixTable = await Matrix_Table.findAll({
            where: { userId: user.id }
        })

        const myComet = userItemsInMAtrixTable.reduce((a, b) => a + b.count, 0);
        const allPlanet = await Matrix_Table.count()
        // const allComet = userItemsInMAtrixTable.reduce((a, b) => {
        //     if (b.count > 0) {
        //         console.log(b.count + 1);
        //         a = a + b.count 
        //     }
        //     return a 
        // }, 0);
        const allComet = (await summColumnStatistic())[0].dataValues.all_count


        const my_planet = await Matrix_Table.count({ where: { userId: user.id } })

        let newItem = { all_comet: allComet, all_planet: allPlanet, first_planet: 0, my_comet: myComet, my_inventory_income: 0, my_planet, structure_planet: 0, userId: user.id }
        updateOrCreate(Statistic, { userId: user.id }, newItem)
        checkForLevel(parentId, level)
        updateStatistic(allComet, allPlanet)
        return res.json(true);

    }

    async statistic(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let statisticItems = await Statistic.findOne({ where: { userId: user.id, } })
        let statisticItemsAll = await Statistic.findOne()
        const active = await Matrix_Table.count({ where: { count: { [Op.gt]: 0 } } })
        if (!statisticItems) {
            return res.json({ allPlanet: statisticItemsAll.all_planet, myPlanet: 0, allComet: statisticItemsAll.all_comet, myComet: 0, firstPlanet: 0, structurePlanet: 0, myInventoryIncome: 0, active })
        }
        const result = { allPlanet: statisticItems.all_planet, myPlanet: statisticItems.my_planet, allComet: statisticItems.all_comet, myComet: statisticItems.my_comet, firstPlanet: 0, structurePlanet: 0, myInventoryIncome: 0, active }

        return res.json(result)


    }

    async list(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let matrixTableItems = await Matrix_Table.findAll({ where: { userId: user.id, } })
        let items = matrixTableItems.map((i) => {
            return { level: i.typeMatrixId, id: i.id, createDate: i.createdAt }
        })
        let data = { count: 0, items }
        return res.json({ data, status: true })
    }

    async update(req, res, next) {
        const { planets } = req.body;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        let summ = planets.length * 2160;
        if (+(user.balance) < summ) {
            return next(ApiError.badRequest("Недостаточно средств"));
        }
        let update = { balance: `${((+ user.balance) - summ)}.00000000` }
        let temp = await User.update(update, { where: { username: decodeToken.username } })
        planets.map(async (id) => {
            let matrix = await Matrix_Table.findOne({ where: id })
            let updatedMatrix = { count: (matrix.count + 2160) }
            let tempMatrix = await Matrix_Table.update(updatedMatrix, { where: { id: id } })
        })
        let statisticItems = await Statistic.findOne({ where: { userId: user.id, } })
        let updateData = {my_comet: statisticItems.my_comet + summ}
        const updatedStatistic = await Statistic.update(updateData,{where:{userId: user.id,}})
        let allPlanet = statisticItems.all_planet;
        let allComet = statisticItems.all_comet + summ;
        updateStatistic(allComet, allPlanet)
        return res.json(true)

    }
}


module.exports = new StarControllers();