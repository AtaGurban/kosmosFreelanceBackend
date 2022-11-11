const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const sequelize = require('../db')
const { Op } = require("sequelize");
const findParentId = require('../service/findParentId')
const checkCountParentId = require('../service/checkCountParentId')
const marketingCheckCount = require('../service/marketingCheckCount')
const marketingGift = require('../service/marketingGift')

const {
    User,
    Matrix,
    Matrix_Table,
    Statistic,
    InvestBox,
    Matrix_TableSecond,
    MatrixSecond
} = require("../models/models");

const updateOrCreate = async function (model, where, newItem) {
    // First try to find the record
    await model.findOne({ where: where }).then(async function (foundItem) {
        (!foundItem) ? (await model.create(newItem)) : (await model.update(newItem, { where: where }))
    })
}

const remunerationUser = async(user, summ)=>{
    let updateBalance = { balance: `${(+user.balance) + summ}.00000000` };
    await User.update(updateBalance, { where: { id: user.id } });
    const statisticData = await Statistic.findOne({where:{userId:user.id}})
    let updateStatisticInventory = {myInviterIncome:statisticData.myInviterIncome + summ}
    await Statistic.update(updateStatisticInventory, {where:{id:statisticData.id}})
}
const remunerationReferal = async(user, summ)=>{
    const referalMatrix = await Matrix_Table.findOne({where:{userId:user.referal_id}})
    if (referalMatrix){
        const referalUser = await User.findOne({where:{id:user.referal_id}})
        let updateReferalBalance = { balance: `${(+referalUser.balance) + summ}.00000000` };
        await User.update(updateReferalBalance, { where: { id: user.referal_id } });
    }
}

const giftMatrixMilkyWay = async(user, count)=>{
    for (let i = 0; i < count; i++) {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return (((i.matrix_table[0]?.typeMatrixId === 1)))
        })
        const parentId = matrix[0]?.id
        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentId,
            userId: user.id
        })
        const matrixTableItem = await Matrix_Table.create({
            matrixId: matrixItem.id,
            typeMatrixId: 1,
            userId: user.id,
            count: 2160
        })
        const userItemsInMAtrixTable = await Matrix_Table.findAll({
            where: { userId: user.id }
        })
        const myComet = userItemsInMAtrixTable.reduce((a, b) => a + b.count, 0);
        const allPlanet = await Matrix_Table.count()
        const allComet = (await summColumnStatistic())[0].dataValues.all_count
        const my_planet = await Matrix_Table.count({ where: { userId: user.id } })
        let newItem = { all_comet: allComet, all_planet: allPlanet, first_planet: 0, my_comet: myComet, my_planet, structure_planet: 0, userId: user.id }
        await updateOrCreate(Statistic, { userId: user.id }, newItem)
        await checkForLevel(parentId, 1)
        await updateStatistic(allComet, allPlanet)  
    }
}

const giftInvest = async(user, summ)=>{
    const investBoxItem = await InvestBox.create({
        status:'активный',
        userId:user.id,
        summ:summ
    })
}

const giftPegas = async(user, count)=>{
    const mOneMatrix = await Matrix_TableSecond.findOne({where:{userId:user.id, typeMatrixSecondId:1}})
    if (mOneMatrix){
        let updateCount = { count: mOneMatrix.count + count }
        await Matrix_TableSecond.update(updateCount, { where: { id: mOneMatrix.id } })
    } else {
        const referalId = user.referal_id;
        let parentIdPegas, side_matrix;
        const parentIdForCheck = await findParentId(
          1,
          referalId,
          user.id
        );
        if (parentIdForCheck) {
          const resultFuncCheckCountParentId = await checkCountParentId(
            parentIdForCheck,
            user.id,
            1
          );
          parentIdPegas = resultFuncCheckCountParentId.parentId;
          side_matrix = resultFuncCheckCountParentId.side_matrix;
        } else {
          parentIdPegas = null;
          side_matrix = null;
        }
  
        const matrixItem = await MatrixSecond.create({
          date: new Date(),
          parent_id: parentIdPegas,
          userId: user.id,
          side_matrix,
        });
  
        const matrixTableItem = await Matrix_TableSecond.create({
          matrixSecondId: matrixItem.id,
          typeMatrixSecondId: 1,
          userId: user.id,
          count: (count - 1), 
        });
        const marketingCheck = await marketingCheckCount(parentIdPegas);
        let marketingGiftResult = [];
        if (marketingCheck.length > 0) {
          marketingCheck.map(async (i) => {
            if (i.count) {
              marketingGiftResult.push(await marketingGift(
                i.count,
                i.parentId,
                1
              ));
            }
          })
        }
    }
}

const giftMarketing = async function (level, matrixTableData){
    const user = await User.findOne({where:{id:matrixTableData.userId}})
    switch (level) {
        case 1:
            //woznograzdeniya
            await remunerationUser(user, 2160)
            //referal woznograzdeniya
            await remunerationReferal(user, 1080)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 1)
            //investbox
            await giftInvest(user, 1000)
            //klon m1
            await giftPegas(user, 2)
            break;
        case 2:
            //woznograzdeniya
            await remunerationUser(user, 6480)
            //referal woznograzdeniya
            await remunerationReferal(user, 3240)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 2)
            //investbox
            await giftInvest(user, 1500)
            //klon m1
            await giftPegas(user, 5)
            break;
        case 3:
            //woznograzdeniya
            await remunerationUser(user, 12960)
            //referal woznograzdeniya
            await remunerationReferal(user, 6480)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 5)
            //investbox
            await giftInvest(user, 2000)
            //klon m1
            await giftPegas(user, 7)
            break;
        case 4:
            //woznograzdeniya
            await remunerationUser(user, 25920)
            //referal woznograzdeniya
            await remunerationReferal(user, 12960)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 10)
            //investbox
            await giftInvest(user, 2500)
            //klon m1
            await giftPegas(user, 10)
            break;
        case 5:
            //woznograzdeniya
            await remunerationUser(user, 30000)
            //referal woznograzdeniya
            await remunerationReferal(user, 15000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 15)
            //investbox
            await giftInvest(user, 3000)
            //klon m1
            await giftPegas(user, 13)
            break;
        case 6:
            //woznograzdeniya
            await remunerationUser(user, 55000)
            //referal woznograzdeniya
            await remunerationReferal(user, 27500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 20)
            //investbox
            await giftInvest(user, 3500)
            //klon m1
            await giftPegas(user, 16)
            break;
        case 7:
            //woznograzdeniya
            await remunerationUser(user, 75000)
            //referal woznograzdeniya
            await remunerationReferal(user, 37500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 25)
            //investbox
            await giftInvest(user, 4000)
            //klon m1
            await giftPegas(user, 19)
            break;
        case 8:
            //woznograzdeniya
            await remunerationUser(user, 95000)
            //referal woznograzdeniya
            await remunerationReferal(user, 47500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 40)
            //investbox
            await giftInvest(user, 4500)
            //klon m1
            await giftPegas(user, 22)
            break;
        case 9:
            //woznograzdeniya
            await remunerationUser(user, 120000)
            //referal woznograzdeniya
            await remunerationReferal(user, 60000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 45)
            //investbox
            await giftInvest(user, 5000)
            //klon m1
            await giftPegas(user, 25)
            break;
        case 10:
            //woznograzdeniya
            await remunerationUser(user, 300000)
            //referal woznograzdeniya
            await remunerationReferal(user, 150000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 50)
            //investbox
            await giftInvest(user, 5500)
            //klon m1
            await giftPegas(user, 28)
            break;
    
        default:
            break;
    }
}

const updateStatistic = async (all_comet, all_planet) => {
    let update = { all_comet, all_planet }

    const allItems = await Statistic.update(update, { where: { id: { [Op.not]: 0 } } })
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
    if (!parentId){
        return false
    }
    let countRows = await Matrix.count({
        where: { parent_id: parentId }
    })
    if (countRows < 3) {
        return false
    } else {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        // const mTable = await Matrix_Table.findAll()
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table[0]?.typeMatrixId === level + 1))
        })
        let parentIdForLevel
        if (matrix.length === 0) {
            parentIdForLevel = null 
        } else {
            // const matrixParentId = Math.ceil(matrix.length / 3)
            // parentIdForLevel = matrix[matrixParentId - 1]?.id || null
            parentIdForLevel = matrix[0].id
        } 

        const user = await Matrix.findOne({where: {id: parentId} })

        const matrixItem = await Matrix.create({ 
            date: new Date,
            parent_id: parentIdForLevel,
            userId: user.userId
        }) 
        // console.log(level, parentId);
        const matrixTableCount = await Matrix_Table.findOne({
            where: { typeMatrixId: level, matrixId: parentId }
        })
        matrixTableCount.matrixId = matrixItem.id;
        matrixTableCount.typeMatrixId = level + 1
        await matrixTableCount.save()

        if (level > 0){
            const gift = await giftMarketing(level, matrixTableCount)
        }
        if(parentIdForLevel && (level < 15)){
            return checkForLevel(parentIdForLevel, level + 1)
        }
    }

}


class StarControllers {

    async buy(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
            where: { username: decodeToken.username },
        });
        if (user.balance < 2160) { 
            return next(ApiError.badRequest("Недостаточно средств"));
        }
        let update = { balance: `${((+ user.balance) - 2160)}.00000000` }

        let temp = await User.update(update, { where: { username: decodeToken.username } })
        const level = 1;
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return (((i.matrix_table[0]?.typeMatrixId === 1)))
        })
        const parentId = matrix[0]?.id
        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentId,
            userId: user.id
        })
        const matrixTableItem = await Matrix_Table.create({
            matrixId: matrixItem.id,
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
        let newItem = { all_comet: allComet, all_planet: allPlanet, first_planet: 0, my_comet: myComet, my_planet, structure_planet: 0, userId: user.id }
        await updateOrCreate(Statistic, { userId: user.id }, newItem)
        await checkForLevel(parentId, level)
        await updateStatistic(allComet, allPlanet)
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
            return res.json({ allPlanet: ((statisticItemsAll?.all_planet) ? statisticItemsAll?.all_planet : 0), myPlanet: 0, allComet: ((statisticItemsAll?.all_comet) ? statisticItemsAll?.all_comet : 0), myComet: 0, firstPlanet: 0, structurePlanet: 0, myInventoryIncome: 0, active })
        }
        const result = { allPlanet: statisticItems.all_planet, myPlanet: statisticItems.my_planet, allComet: statisticItems.all_comet, myComet: statisticItems.my_comet, firstPlanet: 0, structurePlanet: 0, myInventoryIncome: statisticItems.myInviterIncome, active }

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
        let updateData = { my_comet: statisticItems.my_comet + summ }
        const updatedStatistic = await Statistic.update(updateData, { where: { userId: user.id, } })
        let allPlanet = statisticItems.all_planet;
        let allComet = statisticItems.all_comet + summ;
        updateStatistic(allComet, allPlanet)
        return res.json(true)

    }
}


module.exports = new StarControllers();