const {
    MatrixSecond,
  } = require("../models/models");

const marketingInsideCheck = async (node) => {
    if (!node) {
      return false
    }
    const countNode = await MatrixSecond.findAll({
      where: { parent_id: node.id },
    });
    if (countNode.length < 2) {
      return false;
    }
    let count = 3;
    const rightNode = countNode.filter((i) => {
      return i.side_matrix === 0
    })
    const leftNode = countNode.filter((i) => {
      return i.side_matrix === 1
    })
    const countRightMatrix = await MatrixSecond.count({
      where: { parent_id: rightNode[0].id },
    });
  
    const countLeftMatrix = await MatrixSecond.count({
      where: { parent_id: leftNode[0].id },
    });
    if (countRightMatrix == 0) {
      return false
    } else if (countRightMatrix == 1) {
      return { count: 4, parentId: node.id }
    } else if ((countRightMatrix == 2) && (countLeftMatrix == 0)) {
      return { count: 5, parentId: node.id }
    } else if ((countLeftMatrix == 1) && (countRightMatrix == 2)) {
      return { count: 6, parentId: node.id }
    }
    return {
      count: count + countRightMatrix + countLeftMatrix,
      parentId: node.id,
    };
  }




module.exports = async (parentId) => {
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
    let result = [];
    result[0] = await marketingInsideCheck(parentOneStep)
    result[1] = await marketingInsideCheck(parentTwoStep)
    return result
  };
  