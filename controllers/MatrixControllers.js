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
  Transaction,
} = require("../models/models");

const childNode = async (node, type_matrix_id) => {
  if (!node) {
    return null;
  }
  let matrix = await MatrixSecond.findAll({
    where: { parent_id: node },
    include: {
      model: User,
      as: "user",
    },
  });
  return matrix;
};

const marketingInsideCheck = async (node)=>{
  if (!node){
    return false
  }
  const countNode = await MatrixSecond.findAll({
    where: { parent_id: node.id },
  });
  if (countNode.length < 2) {
    return false;
  }
  let count = 3;
  const countRightMatrix = await MatrixSecond.count({
    where: { parent_id: countNode[0].id },
  });
  const countLeftMatrix = await MatrixSecond.count({
    where: { parent_id: countNode[1].id },
  });
  if (countRightMatrix == 0){
    return false
  } else if (countRightMatrix == 1){
    return {count: 4, parentId:node.id}
  }
  return {
    count: count + countRightMatrix + countLeftMatrix,
    parentId: node.id,
  };
}

const marketingCheckCount = async (parentId) => {
  if (!parentId) {
    return [];
  }
  const parentOneStep = await MatrixSecond.findOne({ where: { id: parentId } });
  // if (!parentOneStep.parent_id) {
  //   return false;
  // }
  const parentTwoStep = await MatrixSecond.findOne({
    where: { id: parentOneStep.parent_id },
  });
  // const countParentTwoStep = await MatrixSecond.findAll({
  //   where: { parent_id: parentTwoStep.id },
  // });
  // if (countParentTwoStep.length < 2) {
  //   return false;
  // }
  // let count = 3;
  // const countRightMatrix = await MatrixSecond.count({
  //   where: { parent_id: countParentTwoStep[0].id },
  // });
  // const countLeftMatrix = await MatrixSecond.count({
  //   where: { parent_id: countParentTwoStep[1].id },
  // });
  // return {
  //   count: count + countRightMatrix + countLeftMatrix,
  //   parentId: parentTwoStep.id,
  // };

  let result = [];
  result[0] = await marketingInsideCheck(parentOneStep)
  result[1] = await marketingInsideCheck(parentTwoStep)
  return result
};

const marketingGift = async (count, parentId, typeMatrix) => {
  const matrixTableData = await MatrixSecond.findOne({
    where: { id: parentId },
  });
  const user = await User.findOne({ where: { id: matrixTableData.userId } });
  switch (typeMatrix) {
    case 1:
      if (count >= 4) {
        const transactionCheck = await Transaction.findOne({where:{parent_matrix_id:parentId,  transaction_type: 11,}})
        if (transactionCheck){
          return false
        } else {
          let update = { balance: `${(+user.balance) + 500}.00000000` };
          await User.update(update, { where: { id: user.id } });
          const transaction = await Transaction.create({
            comment:'Выплата за 4 место',
            date_of_transaction: new Date(),
            position: 3,
            transaction_type: 11,
            value:500,
            parent_matrix_id:parentId,
            userId:user.id
          })
        }
      }
      if (count === 7) {
        const checkMatrixTable = await Matrix_TableSecond.findOne({where:{userId:user.id, typeMatrixSecondId: 2}})
        if (!checkMatrixTable){
          const referalId = user.referal_id;
          let parentId, side_matrix;
          const parentIdForCheck = await findParentId(
            2,
            referalId,
            user.id
          );
          if (parentIdForCheck) {
            const resultFuncCheckCountParentId = await checkCountParentId(
              parentIdForCheck,
              user.id, 
              2
            );
            parentId = resultFuncCheckCountParentId.parentId;
            side_matrix = resultFuncCheckCountParentId.side_matrix;
          } else {
            parentId = null;
            side_matrix = null;
          }
          const matrixItem = await MatrixSecond.create({
            date: new Date(),
            parent_id: parentId,
            userId: user.id,
            side_matrix,
          });
  
          const matrixTableItem = await Matrix_TableSecond.create({
            matrixSecondId: matrixItem.id,
            typeMatrixSecondId: 2,
            userId: user.id,
            count: 0,
          });
        } else {
          const transactionCheck = await Transaction.findOne({where:{parent_matrix_id:checkMatrixTable.matrixSecondId,  transaction_type: 12,}})
          if (transactionCheck){
            return false
          } else {
            let update = {count: checkMatrixTable.count + 1}
            await Matrix_TableSecond.update(update, {where:{id:checkMatrixTable.id}})
            const transaction = await Transaction.create({
              comment:'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 12,
              value:1000,
              parent_matrix_id:checkMatrixTable.matrixSecondId,
              userId:checkMatrixTable.userId
            })
            return transaction
          }
        }
      }
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
    case 8:
      break;
    case 9:
      break;
    case 10:
      break;
    case 11:
      break;
    case 12:
      break;
  }
};

const findParentId = async (typeMatrix, referalId, userId) => {
  const temp = await Matrix_TableSecond.findAll({
    where: { typeMatrixSecondId: typeMatrix },
  });
  if (temp.length === 0) {
    return null;
  }
  if (referalId === userId) {
    return null;
  }
  let matrixTableItems = await Matrix_TableSecond.findOne({
    where: { userId: referalId, typeMatrixSecondId: typeMatrix },
  });
  let parentId =
    matrixTableItems === null ? null : matrixTableItems.matrixSecondId;
  if (!parentId) {
    const referalUser = await User.findOne({ where: { id: referalId } });
    return findParentId(typeMatrix, referalUser.referal_id, referalUser);
  } else {
    return parentId;
  }
};

const findRealUser = async (id, userId) => {
  const matrixSecondItem = await MatrixSecond.findOne({ where: { id } });
  const matrixTableData = await Matrix_TableSecond.findOne({
    where: { matrixSecondId: id },
  });
  if (matrixTableData) {
    const result = await Matrix_TableSecond.findOne({
      where: {
        typeMatrixSecondId: matrixTableData.typeMatrixSecondId,
        userId: userId,
      },
    });
    return result;
  } else {
    return findRealUser(matrixSecondItem.parent_id, userId);
  }
};

const checkCountParentId = async (parentId, userId, typeMatrixSecondId) => {
  const itemsParentId = await MatrixSecond.findAll({ 
    where: { parent_id: parentId },
  });
  if (itemsParentId.length > 1) {
    // const leftItem = itemsParentId[0].userId;
    // const rightItem = itemsParentId[1].userId;
    let one = await checkCountParentId(itemsParentId[0].id, userId);
    let two = await checkCountParentId(itemsParentId[1].id, userId);
    let countOne = await MatrixSecond.count({
      where: { parent_id: one.parentId },
    });
    let countTwo = await MatrixSecond.count({
      where: { parent_id: two.parentId },
    });
    if (countOne > countTwo) {
      return one;
    } else if (countOne < countTwo) {
      return two;
    } else {
      if (one.parentId < two.parentId) {
        return one;
      } else {
        return two;
      }
    }
  } else if (itemsParentId.length > 0) {
    return { parentId, side_matrix: 1 };
  } else {
    return { parentId, side_matrix: 0 };
  }
};

class MatrixController {
  async getCount(req, res, next) {
    const count = await CloneStatSecond.findAll();
    return res.json({ items: count });
  }
  async clone(req, res, next) {
    const { matrix_type } = req.query;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const count = await Matrix_TableSecond.findOne({
      where: { userId: user.id, typeMatrixSecondId: matrix_type },
    });
    if (count?.count) {
      return res.json({ count: count.count }); 
    } else {
      return res.json(null);
    }
  }
  async targetClone(req, res, next) {
    let { place, ancestor_id } = req.body;
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    // const matrixData = await MatrixSecond.findOne({where:{id:ancestor_id}})
    const matrixTableData = await findRealUser(ancestor_id, user.id);
    // await Matrix_TableSecond.findOne({where:{userId:user.id, matrixSecondId:(matrixData.id )}})
    if (matrixTableData.count < 1) {
      return next(ApiError.badRequest("Недостатосно count"));
    }
    let update = { count: matrixTableData.count - 1 };
    await Matrix_TableSecond.update(update, {
      where: { id: matrixTableData.id },
    });
    const typeMatrix = (
      await Matrix_TableSecond.findOne({ where: { id: matrixTableData.id } })
    ).typeMatrixSecondId;
    place = +place
    // const type = await Matrix_TableSecond.findOne({
    //   where: { id: ancestor_id },
    // });
    let side_matrix;
    let parent_id;
    switch (place) {
      case 1:
        side_matrix = 0;
        parent_id = ancestor_id;
        break;
      case 2:
        side_matrix = 1;
        parent_id = ancestor_id;
        break;
      case 3:
        side_matrix = 0;
        parent_id = (
          await MatrixSecond.findOne({
            where: { parent_id: ancestor_id, side_matrix: 0 },
          })
        ).id;
        break;
      case 4:
        side_matrix = 1;
        parent_id = (
          await MatrixSecond.findOne({
            where: { parent_id: ancestor_id, side_matrix: 0 },
          })
        ).id;
        break;
      case 5:
        side_matrix = 0;
        parent_id = (
          await MatrixSecond.findOne({
            where: { parent_id: ancestor_id, side_matrix: 1 },
          })
        ).id;
        break;
      case 6:
        side_matrix = 1;
        parent_id = (
          await MatrixSecond.findOne({
            where: { parent_id: ancestor_id, side_matrix: 1 },
          })
        ).id;
        break;
    }
    const matrixItem = MatrixSecond.create({
      date: new Date(),
      parent_id: parent_id,
      userId: user.id,
      side_matrix,
    });

    const marketingCheck = await marketingCheckCount(parent_id);
    let marketingGiftResult = [];
    if (marketingCheck.length > 0) {
      marketingCheck.map(async(i)=>{
        if (i.count){
          marketingGiftResult.push(await marketingGift(
            i.count,
            i.parentId,
            typeMatrix
            ));
          }
        })
        
      }
      return res.json(marketingCheck); 
    // const matrixTableItem = await Matrix_TableSecond.create({
    //   matrixSecondId: parent_id,
    //   typeMatrixSecondId: type.typeMatrixSecondId ,
    //   userId: user.id,
    //   count: 0
    // })
  }
  async getType(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const type = await Matrix_TableSecond.findAll({
      where: { userId: user.id },
    });
    const typeMatrix = await TypeMatrixSecond.findAll();

    let result = [];
    type.map((i, index) => {
      result.push({
        id: index + 1,
        count: i.count,
        name: typeMatrix[index].name,
        level: i.typeMatrixSecondId,
        canBuy: true,
        isActive: true,
        summ: typeMatrix[index].summ,
      });
    });
    for (let i = result.length + 1; i < 13; i++) {
      result.push({
        id: i,
        count: 0,
        name: typeMatrix[i - 1].name,
        level: i,
        canBuy: true,
        isActive: true,
        summ: typeMatrix[i - 1].summ,
      });
    }
    return res.json({ items: result });
  }
  async buy(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const { matrix_id } = req.body;
    const price = (await TypeMatrixSecond.findOne({ where: { id: matrix_id } }))
      .summ;
    const user = await User.findOne({ where: { username } });
    if (+user.balance < price) {
      return next(ApiError.badRequest("Недостатосно средств"));
    }
    let update = { balance: `${user.balance - price}.00000000` };
    await User.update(update, { where: { id: user.id } });
    let checkMatrixTable = await Matrix_TableSecond.findOne({
      where: { userId: user.id, typeMatrixSecondId: matrix_id },
    });
    if (!checkMatrixTable) {
      const referalId = user.referal_id;
      let parentId, side_matrix;
      const parentIdForCheck = await findParentId(
        matrix_id,
        referalId,
        user.id
      );
      if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentId(
          parentIdForCheck,
          user.id,
          matrix_id
        );
        // return res.json(resultFuncCheckCountParentId)
        parentId = resultFuncCheckCountParentId.parentId;
        side_matrix = resultFuncCheckCountParentId.side_matrix;
      } else {
        parentId = null;
        side_matrix = null;
      }
      // console.log(result);

      const matrixItem = await MatrixSecond.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
      });

      const matrixTableItem = await Matrix_TableSecond.create({
        matrixSecondId: matrixItem.id,
        typeMatrixSecondId: matrix_id,
        userId: user.id,
        count: 0,
      });
      const marketingCheck = await marketingCheckCount(parentId);
      let marketingGiftResult = [];
      if (marketingCheck.length > 0) {
        marketingCheck.map(async (i)=>{
          if (i.count){
            marketingGiftResult.push(await marketingGift(
            i.count,
            i.parentId,
            matrix_id
          ));
          }
        })

        return res.json(marketingGiftResult);
      }
    } else {
      let updateTable = { count: checkMatrixTable.count + 1 };
      await Matrix_TableSecond.update(updateTable, {
        where: { userId: user.id, typeMatrixSecondId: matrix_id },
      });
      return res.json(updateTable);
    }
  }
  async structureUpper(req, res, next) {
    const { matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = await Matrix.findOne({ where: { id: matrix_id } });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const downUsers = await Matrix_Table.findAll({
        where: { matrix_parent_id: matrix_id },
        include: {
          model: User,
          as: "user",
          where: { id: { [Op.not]: 1 } },
          include: { model: Matrix, as: "matrix" },
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
            id: downUsers[index].user.matrix[
              downUsers[index].type_matrix_id - 1
            ].id,
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
      const rootUserId = await MatrixSecond.findOne({
        where: { id: matrix_id },
      });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });

      const firstChildes = await childNode(matrix_id);
      let secondChildes;
      let thirdChildes;
      if (firstChildes && firstChildes[0]) {
        if (firstChildes[0].side_matrix === 0) {
          secondChildes = await childNode(firstChildes[0]?.id);
          thirdChildes = await childNode(firstChildes[1]?.id);
        } else {
          secondChildes = await childNode(firstChildes[1]?.id);
          thirdChildes = await childNode(firstChildes[0]?.id);
        }
      }

      let result = {
        0: {
          id: matrix_id,
          userName: rootUser.username,
          photo: rootUser.avatar,
          typeId: null,
          place: 0,
          date: rootUser.createdAt,
        },
      };

      if (firstChildes?.length > 0) {
        firstChildes.map((i, index) => {
          result[i.side_matrix + 1] = {
            id: firstChildes[index]?.id,
            userName: firstChildes[index]?.user.username,
            photo: firstChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: firstChildes[index]?.user.createdAt,
          };
        });
      }
      if (secondChildes?.length > 0) {
        secondChildes.map((i, index) => {
          result[i.side_matrix + 3] = {
            id: secondChildes[index]?.id,
            userName: secondChildes[index]?.user.username,
            photo: secondChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: secondChildes[index]?.user.createdAt,
          };
        });
      }
      if (thirdChildes?.length > 0) {
        thirdChildes.map((i, index) => {
          result[i.side_matrix + 5] = {
            id: thirdChildes[index]?.id,
            userName: thirdChildes[index]?.user.username,
            photo: thirdChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: thirdChildes[index]?.user.createdAt,
          };
        });
      }

      for (let i = 0; i < 7; i++) {
        if (!result[i]) {
          result[i] = null;
        }
      }

      return res.json({ items: result });
    }

    if (matrix_type) {
      const { authorization } = req.headers;
      const token = authorization.slice(7);
      const { username } = jwt_decode(token);

      const user = await User.findOne({ where: { username } });
      const dataMatrixTable = await Matrix_TableSecond.findOne({
        where: { userId: user?.id, typeMatrixSecondId: matrix_type },
      });
      if (!dataMatrixTable) {
        let result = {};
        for (let i = 0; i < 7; i++) {
          if (!result[i]) {
            result[i] = null;
          }
        }
        return res.json({ items: result });
      }
      const root_matrix_tables = await MatrixSecond.findOne({
        where: { id: dataMatrixTable?.matrixSecondId },
        include: { model: User, as: "user" },
      });
      // const root_matrix_tables = await MatrixSecond.findAll({
      //   where: { userId: user.dataValues.id },
      //   include: [{
      //     model: User,
      //     as: "user",
      //   }, {
      //     model: Matrix_TableSecond,
      //     as: "matrix_table",
      //     // where: { typeMatrixSecondId: (+matrix_type) }
      //   }],
      // });
      // return res.json(matrixItems)
      // return res.json(matrixItems)
      // const root_matrix_tables = matrixItems.filter((i)=>{
      //   return i.user.matrix_table_two[0].typeMatrixSecondId === (+matrix_type)
      // })

      let result = {
        0: {
          id: root_matrix_tables.id,
          userName: root_matrix_tables.user.username,
          photo: root_matrix_tables.user.avatar,
          typeId: null,
          place: 0,
          createdAt: root_matrix_tables.createdAt,
        },
      };
      let firstChildes = await childNode(root_matrix_tables.id);
      let secondChildes;
      let thirdChildes;
      if (firstChildes && firstChildes[0]) {
        if (firstChildes[0].side_matrix === 0) {
          secondChildes = await childNode(firstChildes[0]?.id);
          thirdChildes = await childNode(firstChildes[1]?.id);
        } else {
          secondChildes = await childNode(firstChildes[1]?.id);
          thirdChildes = await childNode(firstChildes[0]?.id);
        }
      }
      if (firstChildes?.length > 0) {
        firstChildes.map((i, index) => {
          result[i.side_matrix + 1] = {
            id: firstChildes[index]?.id,
            userName: firstChildes[index]?.user.username,
            photo: firstChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: firstChildes[index]?.user.createdAt,
          };
        });
      }
      if (secondChildes?.length > 0) {
        secondChildes.map((i, index) => {
          result[i.side_matrix + 3] = {
            id: secondChildes[index]?.id,
            userName: secondChildes[index]?.user.username,
            photo: secondChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: secondChildes[index]?.user.createdAt,
          };
        });
      }
      if (thirdChildes?.length > 0) {
        thirdChildes.map((i, index) => {
          result[i.side_matrix + 5] = {
            id: thirdChildes[index]?.id,
            userName: thirdChildes[index]?.user.username,
            photo: thirdChildes[index]?.user.avatar,
            typeId: null,
            place: 0,
            createdAt: thirdChildes[index]?.user.createdAt,
          };
        });
      }

      for (let i = 0; i < 7; i++) {
        if (!result[i]) {
          result[i] = null;
        }
      }

      // return res.json({ items: {firstChildes, secondChildes, thirdChildes} });
      return res.json({ items: result });
    }
  }
}

module.exports = new MatrixController();