const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { findParentId } = require("../service/findParentIdPegasUno");
const {
  checkCountParentId,
} = require("../service/checkCoountParentIdPegasUno");

const {
  CloneStatThird,
  User,
  Matrix_TableThird,
  TypeMatrixThird,
  MatrixThird,
} = require("../models/models");

const childNode = async (node, type_matrix_id) => {
  if (!node) {
    return null;
  }
  let matrix = await MatrixThird.findAll({
    where: { parent_id: node },
    include: {
      model: User,
      as: "user",
    },
  });
  return matrix;
};

const findRealUser = async (id, userId) => {
  const matrixThirdItem = await MatrixThird.findOne({ where: { id } });
  const matrixTableData = await Matrix_TableThird.findOne({
    where: { matrixThirdId: id },
  });
  if (matrixTableData) {
    const result = await Matrix_TableThird.findOne({
      where: {
        typeMatrixThirdId: matrixTableData.typeMatrixThirdId,
        userId: userId,
      },
    });
    return result;
  } else {
    return findRealUser(matrixThirdItem.parent_id, userId);
  }
};

class PegasUnoControllers {
  async getCloneStat(req, res, next) {
    const count = await CloneStatThird.findAll();
    return res.json({ items: count });
  }
  async buy(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const { matrix_id } = req.body;
    const price = (await TypeMatrixThird.findOne({ where: { id: matrix_id } }))
      .summ;
    const user = await User.findOne({ where: { username } });
    if (+user.balance < price) {
      return next(ApiError.badRequest("Недостатосно средств"));
    }
    let update = { balance: `${user.balance - price}.00000000` };
    await User.update(update, { where: { id: user.id } });
    let checkMatrixTable = await Matrix_TableThird.findOne({
      where: { userId: user.id, typeMatrixThirdId: matrix_id },
    });
    console.log('dsdsd');
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
        parentId = resultFuncCheckCountParentId.parentId;
        side_matrix = resultFuncCheckCountParentId.side_matrix;
      } else {
        parentId = null;
        side_matrix = null;  
      }

      const matrixItem = await MatrixThird.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
      });

      const matrixTableItem = await Matrix_TableThird.create({
        matrixThirdId: matrixItem.id,
        typeMatrixThirdId: matrix_id,
        userId: user.id,
        count: 0,
      });
    //   const marketingCheck = await marketingCheckCount(parentId);
    //   let marketingGiftResult = [];
    //   if (marketingCheck.length > 0) {
    //     marketingCheck.map(async (i) => {
    //       if (i.count) {
    //         marketingGiftResult.push(
    //           await marketingGift(i.count, i.parentId, matrix_id)
    //         );
    //       }
    //     });

        // return res.json(marketingGiftResult);
    //   }
    return res.json(true);
    } else {
        return next(ApiError.badRequest("Вы больше не можете купить"));
    }
  }
  async structure(req, res, next) {
    const { matrix_type, matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = await MatrixThird.findOne({
        where: { id: matrix_id },
      });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });

      const firstChildes = await childNode(matrix_id);

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

      for (let i = 0; i < 3; i++) {
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
      const dataMatrixTable = await Matrix_TableThird.findOne({
        where: { userId: user?.id, typeMatrixThirdId: matrix_type },
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
      const root_matrix_tables = await MatrixThird.findOne({
        where: { id: dataMatrixTable?.matrixThirdId },
        include: { model: User, as: "user" },
      });

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

      for (let i = 0; i < 3; i++) {
        if (!result[i]) {
          result[i] = null;
        }
      }
      return res.json({ items: result });
    }
  }
  async structureUpper(req, res, next) {
    const { matrix_id } = req.query;

    if (matrix_id) {
      const rootUserId = await MatrixThird.findOne({ where: { id: matrix_id } });
      const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
      const firstChildes = await childNode(matrix_id);

      let result = {
        0: {
          id: matrix_id,
          username: rootUser.username,
          avatar: rootUser.avatar,
          typeId: null,
          place: 0,
          createdAt: rootUser.createdAt,
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

      for (let i = 0; i < 3; i++) {
        if (!result[i]) {
          result[i] = null;
        }
      }

      return res.json({ items: result });
    }
  }
  async getType(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const type = await Matrix_TableThird.findAll({
      where: { userId: user.id },
    });
    const typeMatrix = await TypeMatrixThird.findAll();

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
}

module.exports = new PegasUnoControllers();
