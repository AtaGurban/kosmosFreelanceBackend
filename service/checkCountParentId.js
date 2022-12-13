const {
    MatrixSecond,
  } = require("../models/models");

  const checkCountParentId = async (parentId, userId, typeMatrixSecondId) => {
    const itemsParentId = await MatrixSecond.findAll({
      where: { parent_id: parentId },
    });
    if (itemsParentId.length > 1) {
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

  module.exports = {checkCountParentId}