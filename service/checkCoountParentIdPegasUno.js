const {
     MatrixThird,
  } = require("../models/models");

  const checkCountParentIdPegasUno = async (parentId, userId, typeMatrixSecondId) => {
    const itemsParentId = await MatrixThird.findAll({
      where: { parent_id: parentId },
    });
    if (itemsParentId.length > 1) {
      // const leftItem = itemsParentId[0].userId;
      // const rightItem = itemsParentId[1].userId;
      let one = await checkCountParentIdPegasUno(itemsParentId[0].id, userId);
      let two = await checkCountParentIdPegasUno(itemsParentId[1].id, userId);
      let countOne = await MatrixThird.count({
        where: { parent_id: one.parentId },
      });
      let countTwo = await MatrixThird.count({
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

  module.exports = {checkCountParentIdPegasUno}