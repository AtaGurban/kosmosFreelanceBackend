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

const childNode = async (node)=>{
  if (!node){
    return null
  }
  const childes = await Matrix_TableSecond.findAll({
    where: { matrixSecondId: node },
    include: {
      model: User, 
      as: "user",
      where:{ id: {[Op.not]: 1} },
    },
  });
  return childes
}


const findParentId = async(typeMatrix, referalId, userId)=>{
  const temp = await Matrix_TableSecond.findAll({where:{typeMatrixSecondId:typeMatrix}})
  if (temp.length === 0){
    return null
  }
  if ((referalId === userId)){
    return null
  }
  // let matrixItems = await Matrix_TableSecond.findOne({where:{userId:referalId, typeMatrixSecondId:typeMatrix}})
  let matrixTableItems =  await Matrix_TableSecond.findOne({where:{userId:referalId, typeMatrixSecondId:typeMatrix}})
  let parentId = matrixTableItems === null ? null : matrixTableItems.id
  if (!parentId){
    const referalUser = await User.findOne({where:{id:referalId}})
    return findParentId(typeMatrix, referalUser.referal_id, referalUser)
  } else{
    return parentId
  }
}


const checkCountParentId = async (parentId, userId, typeMatrixSecondId )=>{
  const itemsParentId = await Matrix_TableSecond.findAll({where:{matrixSecondId: parentId, typeMatrixSecondId}})
  if (itemsParentId.length > 1){
    const leftItem = itemsParentId[0].userId
    const rightItem = itemsParentId[1].userId
    let one =  await checkCountParentId(itemsParentId[0].id, userId, typeMatrixSecondId)
    let two = await checkCountParentId(itemsParentId[1].id, userId, typeMatrixSecondId)
    if (one.parentId < two.parentId){
      return one
    } else{
      return two
    }

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
  async clone(req, res, next) {
    const {matrix_type} = req.query
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const count = await Matrix_TableSecond.findOne({where:{userId:user.id, typeMatrixSecondId:matrix_type}});
    if (count?.count){
      return res.json({count: count.count});
    } else {
      return res.json(null);
    }
  }
  async targetClone(req, res, next) {
    const {place, ancestor_id} = req.body
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const type = await Matrix_TableSecond.findAll({where:{matrixSecondId :ancestor_id}});
    let side_matrix
    switch (place) {
      case 1:
        side_matrix = 0
        break;
      case 2:
        side_matrix = 1
        break;
      case 3:
        side_matrix = 0
        break;
      case 4:
        side_matrix = 1
        break;
      case 5:
        side_matrix = 0
        break;
      case 6:
        side_matrix = 1
        break;
    }
    const matrixItem = MatrixSecond.create({
      date: new Date,
      parent_id: ancestor_id,
      userId: user.id,
      side_matrix
    })

    const matrixTableItem = await Matrix_TableSecond.create({
      matrixSecondId: ancestor_id,
      typeMatrixSecondId: type.typeMatrixSecondId , 
      userId: user.id,
      count: 0
    })
    return res.json(matrixTableItem)

  }
  async getType(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const type = await Matrix_TableSecond.findAll({where:{userId:user.id}});
    const typeMatrix = await TypeMatrixSecond.findAll()

    let result = []
    type.map((i, index)=>{
      result.push({id:(index + 1), count:i.count,name:typeMatrix[index].name, level:i.typeMatrixSecondId, canBuy:true, isActive:true, summ:typeMatrix[index].summ})
    })
    for (let i = result.length + 1; i < 13; i++) {
      result.push({id: i, count: 0, name: typeMatrix[i - 1].name, level: i, canBuy:true, isActive:true, summ:typeMatrix[i - 1].summ})
    }
    return res.json({ items: result });
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
    let checkMatrixTable = await Matrix_TableSecond.findOne({where:{userId:user.id, typeMatrixSecondId:matrix_id}})
    if (!checkMatrixTable){
      const referalId = user.referal_id;
      let parentId, side_matrix
      const parentIdForCheck = await findParentId(matrix_id, referalId, user.id)
      if (parentIdForCheck){ 
        const resultFuncCheckCountParentId = await checkCountParentId(parentIdForCheck, user.id, matrix_id)
        parentId = resultFuncCheckCountParentId.parentId
        side_matrix = resultFuncCheckCountParentId.side_matrix
      } else {
        parentId = null;
        side_matrix = null;
      }
      // console.log(result);
  
      const matrixItem = MatrixSecond.create({
        date: new Date,
        parent_id: parentId,
        userId: user.id,
        side_matrix
      })
  
      const matrixTableItem = await Matrix_TableSecond.create({
        matrixSecondId: parentId,
        typeMatrixSecondId: matrix_id, 
        userId: user.id,
        count: 0
      })
      
      return res.json(true);
    } else {
      let updateTable = {count: checkMatrixTable.count + 1}
      await Matrix_TableSecond.update(updateTable, {where:{userId:user.id, typeMatrixSecondId:matrix_id}})
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
      const rootUserId = await MatrixSecond.findOne({ where: { id: matrix_id } });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });

      const firstChildes = await childNode(matrix_id)
      const secondChildes = await childNode(firstChildes[0]?.id)
      const thirdChildes = await childNode(firstChildes[1]?.id)

      let result = {
        0: {
          id: rootUserId.parent_id,
          userName: rootUser.username,
          photo: rootUser.avatar,
          typeId: null, 
          place: 0,
          date: rootUser.createdAt,
        },
      };

      if (firstChildes?.length > 0) {
          result[1] = {
            id: firstChildes[0].id,
            userName: firstChildes[0].user.username,
            photo: firstChildes[0].user.avatar,
            typeId: null,
            place: 0,
            createdAt: firstChildes[0].user.createdAt,
          };
          if (firstChildes[1]){
            result[2] = {
              id: firstChildes[1].id,
              userName: firstChildes[1].user.username,
              photo: firstChildes[1].user.avatar,
              typeId: null,
              place: 0,
              createdAt: firstChildes[1].user.createdAt,
            };
          } else {
            result[2] = null
            result[5] = null
            result[6] = null
          }
      } else {
        for (let i = 1; i < 7; i++) {
          result[i] = null       
        }
      }

      if (secondChildes?.length > 0){
        result[3] = {
          id: secondChildes[0].id,
          userName: secondChildes[0].user.username,
          photo: secondChildes[0].user.avatar,
          typeId: null,
          place: 0,
          createdAt: secondChildes[0].user.createdAt,
        };
        if (secondChildes[1]){
          result[4] = {
            id: secondChildes[1].id,
            userName: secondChildes[1].user.username,
            photo: secondChildes[1].user.avatar,
            typeId: null,
            place: 0,
            createdAt: secondChildes[1].user.createdAt,
          };
        } else {
          result[4] = null
        }
      } else {
        result[3] = null
        result[4] = null
      }

      if (thirdChildes?.length > 0){
        result[5] = {
          id: thirdChildes[0].id,
          userName: thirdChildes[0].user.username,
          photo: thirdChildes[0].user.avatar,
          typeId: null,
          place: 0,
          createdAt: thirdChildes[0].user.createdAt,
        };
        if (secondChildes[1]){
          result[4] = {
            id: thirdChildes[1].id,
            userName: thirdChildes[1].user.username,
            photo: thirdChildes[1].user.avatar,
            typeId: null,
            place: 0,
            createdAt: thirdChildes[1].user.createdAt,
          };
        } else {
          result[6] = null
        }
      } else {
        result[5] = null
        result[6] = null
      }
      
      return res.json({ items: result });
    }

    if (matrix_type) {
      const { authorization } = req.headers;
      const token = authorization.slice(7);
      const { username } = jwt_decode(token);

      const user = await User.findOne({ where: { username } });

      const root_matrix_tables = await Matrix_TableSecond.findOne({
        where: { typeMatrixSecondId: matrix_type, userId: user.dataValues.id },
        include: {
          model: User,
          as: "user", 
        },
      });

      let result = {
        0: {
          id: root_matrix_tables.matrixSecondId,
          userName: root_matrix_tables.user.username,
          photo: root_matrix_tables.user.avatar,
          typeId: null,
          place: 0,
          createdAt: root_matrix_tables.createdAt,
        },
      };
      const firstChildes = await childNode(root_matrix_tables.id)
      const secondChildes = await childNode(firstChildes[0]?.id)
      const thirdChildes = await childNode(firstChildes[1]?.id)

      if (firstChildes?.length > 0) {
        result[1] = {
          id: firstChildes[0].id,
          userName: firstChildes[0].user.username,
          photo: firstChildes[0].user.avatar,
          typeId: null,
          place: 0,
          createdAt: firstChildes[0].user.createdAt,
        };
        if (firstChildes[1]){
          result[2] = {
            id: firstChildes[1].id,
            userName: firstChildes[1].user.username,
            photo: firstChildes[1].user.avatar,
            typeId: null,
            place: 0,
            createdAt: firstChildes[1].user.createdAt,
          };
        } else {
          result[2] = null
          result[5] = null
          result[6] = null
        }
    } else {
      for (let i = 1; i < 7; i++) {
        result[i] = null       
      }
    }

    if (secondChildes?.length > 0){
      result[3] = {
        id: secondChildes[0].id,
        userName: secondChildes[0].user.username,
        photo: secondChildes[0].user.avatar,
        typeId: null,
        place: 0,
        createdAt: secondChildes[0].user.createdAt,
      };
      if (secondChildes[1]){
        result[4] = {
          id: secondChildes[1].id,
          userName: secondChildes[1].user.username,
          photo: secondChildes[1].user.avatar,
          typeId: null,
          place: 0,
          createdAt: secondChildes[1].user.createdAt,
        };
      } else {
        result[4] = null
      }
    } else {
      result[3] = null
      result[4] = null
    }

    if (thirdChildes?.length > 0){
      result[5] = {
        id: thirdChildes[0].id,
        userName: thirdChildes[0].user.username,
        photo: thirdChildes[0].user.avatar,
        typeId: null,
        place: 0,
        createdAt: thirdChildes[0].user.createdAt,
      };
      if (secondChildes[1]){
        result[4] = {
          id: thirdChildes[1].id,
          userName: thirdChildes[1].user.username,
          photo: thirdChildes[1].user.avatar,
          typeId: null,
          place: 0,
          createdAt: thirdChildes[1].user.createdAt,
        };
      } else {
        result[6] = null
      }
    } else {
      result[5] = null
      result[6] = null
    }
      return res.json({ items: result });
    }

  }
}

module.exports = new MatrixController();
 