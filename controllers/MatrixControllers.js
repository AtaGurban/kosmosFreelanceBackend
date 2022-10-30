const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { Op, where } = require("sequelize");

const {
  CloneStatSecond,
  TypeMatrix,
  Matrix_Table,
  User,
  Matrix,
  TypeMatrixSecond,
  MatrixSecond,
  Matrix_TableSecond,
} = require("../models/models");

const findParentId = async(typeMatrix, referalId, userId)=>{
  if ((referalId === userId)){
    console.log('1');
    return null
  }
  let matrixItems = await MatrixSecond.findOne({where:{userId:referalId}})
  let matrixTableItems = matrixItems ? await Matrix_TableSecond.findOne({where:{userId:referalId, matrixSecondId:matrixItems?.parent_id, typeMatrixSecondId:typeMatrix}}) : null
  let parentId = matrixTableItems === null ? null : matrixItems.id
  if (!parentId){
    console.log('2');
    const referalUser = await User.findOne({where:{id:referalId}})
    return findParentId(typeMatrix, referalUser.referal_id, referalUser)
  } else{
    console.log('3');
    return parentId
  }
}


const checkCountParentId = async (parentId)=>{
  const itemsParentId = await MatrixSecond.findAll({where:{parent_id:parentId}})
  if (itemsParentId.length > 1){
    const itemsParentIdFirst = await MatrixSecond.findAll({where:{parent_id:itemsParentId[0].id}})

    // if (itemsParentIdFirst.length > 0){
    //   return {parentId:itemsParentId[0].parent_id, side_matrix : 1}
    // } else if (itemsParentIdFirst.length === 0) {
    //   return {parentId:itemsParentId[0].parent_id, side_matrix : 0}
    // } else {
    //   const itemsParentIdSecond = await MatrixSecond.findAll({where:{parent_id:itemsParentId[1].parent_id}})
    //   if (itemsParentIdSecond.length === 0){
    //     return {parentId:itemsParentId[1].parent_id, side_matrix : 0}
    //   } else if (itemsParentIdSecond.length === 1){
    //     return {parentId:itemsParentId[1].parent_id, side_matrix : 1}
    //   } else {
    //     return checkCountParentId()
    //   }
    // }
  } else if (itemsParentId.length > 0) {
    return {parentId, side_matrix : 1}
  } else {
    return {parentId, side_matrix : 0}
  }
}

class MatrixController {
 
  async getCount(req, res, next) {
    const count = await CloneStatSecond.findAll();
    return res.json({ items: count });
  }
  async getType(req, res, next) {
    const type = await TypeMatrixSecond.findAll();
    return res.json({ items: type });
  }
  async buy(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const {matrix_id} = req.body
    const price = (await TypeMatrixSecond.findOne({where:{id:matrix_id}})).summ
    const user = await User.findOne({ where: { username } });
    if ((+user.balance) < price){
      return next(ApiError.badRequest("Недостатосно средств"));
    } 
    let update = { balance: `${user.balance - price}.00000000` };
    await User.update(update, { where: { id: user.id } });
    let checkMatrixTable = await Matrix_TableSecond.findOne({where:{userId:user.id}})
    if (!checkMatrixTable){
      const referalId = user.referal_id;
    
      const parentIdForCheck = await findParentId(matrix_id, referalId, user.id)
      const parentId = await checkCountParentId(parentIdForCheck)
  
      const matrixItem = MatrixSecond.create({
        date: new Date,
        parent_id: parentId,
        userId: user.id
      })
  
      const matrixTableItem = await Matrix_TableSecond.create({
        matrixSecondId: parentId,
        typeMatrixSecondId: matrix_id, 
        userId: user.id,
        count: 1
      })
      
      return res.json(parentId);
    } else {
      let updateTable = {count: checkMatrixTable.count + 1}
      await Matrix_TableSecond.update(updateTable, {where:{userId:user.id}})
      return res.json(updateTable)
    }

  }
  async structureUpper(req, res, next) {
    const { matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = (await Matrix.findOne({ where: { id: matrix_id } }));
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const downUsers = await Matrix_Table.findAll({
        where: { matrix_parent_id: matrix_id },
        include: {
          model: User,
          as: "user",
          where:{ id: {[Op.not]: 1} },
          include: {model: Matrix, as: 'matrix'}
        },
      });

      let result = {
        0: {
          id: rootUserId.parent_id,
          username: rootUser.username,
          avatar: rootUser.avatar,
          typeId: null,
          place: 0,
          createdAt: rootUser.createdAt,
        },
      };

      if (downUsers) {
        downUsers.map((item, index) => {
          result[index + 1] = {
            id: downUsers[index].user.matrix[downUsers[index].type_matrix_id - 1].id,
            username: downUsers[index].user.username,
            avatar: downUsers[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: downUsers[index].user.createdAt,
          };
        });
      }

      return res.json({ items: result });
    }
  }

  async structure(req, res, next) {
    const { matrix_type, matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = await Matrix.findOne({ where: { id: matrix_id } });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const downUsers = await Matrix_Table.findAll({
        where: { matrix_parent_id: matrix_id },
        include: {
          model: User, 
          as: "user",
          where:{ id: {[Op.not]: 1} },
          include: {model: Matrix, as: 'matrix'}
        },
      });

      let result = {
        0: {
          id: rootUserId.parent_id,
          username: rootUser.username,
          avatar: rootUser.avatar,
          typeId: null,
          place: 0,
          createdAt: rootUser.createdAt,
        },
      };

      if (downUsers) {
        downUsers.map((item, index) => {
          result[index + 1] = {
            id: downUsers[index].user.matrix[downUsers[index].type_matrix_id - 1].id,
            username: downUsers[index].user.username,
            avatar: downUsers[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: downUsers[index].user.createdAt,
          };
        });
      }

      return res.json({ items: result });
    }

    if (matrix_type) {
      const { authorization } = req.headers;
      const token = authorization.slice(7);
      const { username } = jwt_decode(token);

      const user = await User.findOne({ where: { username } });

      const root_matrix_tables = await Matrix_Table.findAll({
        where: { type_matrix_id: matrix_type, userId: user.dataValues.id },
        include: {
          model: User,
          as: "user",
          include: { model: Matrix, as: "matrix" },
        },
      });
      const down_matrix_tables = await Matrix_Table.findAll({
        where: {
          type_matrix_id: matrix_type,
          userId: { [Op.not]: user.dataValues.id },
          // matrix_parent_id: user.dataValues.id
        },
        include: {
          model: User,
          as: "user",
          where: { referal_id: user.dataValues.id },
          include: { model: Matrix, as: "matrix" },
        },
      });

      if (!root_matrix_tables) {
        return next(ApiError.badRequest("root пользователей не найден"));
      }

      let result = {
        0: {
          id: root_matrix_tables[0].matrix_parent_id,
          username: root_matrix_tables[0].user.username,
          avatar: root_matrix_tables[0].user.avatar,
          typeId: null,
          place: 0,
          createdAt: root_matrix_tables[0].createdAt,
        },
      };

      if (down_matrix_tables) {
        down_matrix_tables.map((item, index) => {
          result[index + 1] = {
            id: down_matrix_tables[index].matrix_parent_id,
            username: down_matrix_tables[index].user.username,
            avatar: down_matrix_tables[index].user.avatar,
            typeId: null,
            place: 0,
            createdAt: down_matrix_tables[index].createdAt,
          };
        });
      }

      return res.json({ items: result });
    }

  }
}

module.exports = new MatrixController();
 