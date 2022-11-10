const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { Op } = require("sequelize");
const findParentId = require('../service/findParentId')
const checkCountParentId = require('../service/checkCountParentId')
const marketingGift = require('../service/marketingGift')
const marketingCheckCount = require('../service/marketingCheckCount')

const {
  CloneStatSecond,
  Matrix_Table,
  User,
  Matrix,
  TypeMatrixSecond,
  MatrixSecond,
  Matrix_TableSecond,
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

// const marketingInsideCheck = async (node) => {
//   if (!node) {
//     return false
//   }
//   const countNode = await MatrixSecond.findAll({
//     where: { parent_id: node.id },
//   });
//   if (countNode.length < 2) {
//     return false;
//   }
//   let count = 3;
//   const rightNode = countNode.filter((i) => {
//     return i.side_matrix === 0
//   })
//   const leftNode = countNode.filter((i) => {
//     return i.side_matrix === 1
//   })
//   const countRightMatrix = await MatrixSecond.count({
//     where: { parent_id: rightNode[0].id },
//   });

//   const countLeftMatrix = await MatrixSecond.count({
//     where: { parent_id: leftNode[0].id },
//   });
//   if (countRightMatrix == 0) {
//     return false
//   } else if (countRightMatrix == 1) {
//     return { count: 4, parentId: node.id }
//   } else if ((countRightMatrix == 2) && (countLeftMatrix == 0)) {
//     return { count: 5, parentId: node.id }
//   } else if ((countLeftMatrix == 1) && (countRightMatrix == 2)) {
//     return { count: 6, parentId: node.id }
//   }
//   return {
//     count: count + countRightMatrix + countLeftMatrix,
//     parentId: node.id,
//   };
// }

// const marketingCheckCount = async (parentId) => {
//   if (!parentId) {
//     return [];
//   }
//   const parentOneStep = await MatrixSecond.findOne({ where: { id: parentId } });
//   // if (!parentOneStep.parent_id) {
//   //   return false;
//   // }
//   const parentTwoStep = await MatrixSecond.findOne({
//     where: { id: parentOneStep.parent_id },
//   });
//   let result = [];
//   result[0] = await marketingInsideCheck(parentOneStep)
//   result[1] = await marketingInsideCheck(parentTwoStep)
//   return result
// };

// const marketingGift = async (count, parentId, typeMatrix) => {
//   const matrixTableData = await MatrixSecond.findOne({
//     where: { id: parentId },
//   });
//   const user = await User.findOne({ where: { id: matrixTableData.userId } });
//   switch (typeMatrix) {
//     case 1:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 11, } })
//         if (!transactionCheck) {
//           let update = { balance: `${(+user.balance) + 500}.00000000` };
//           await User.update(update, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 11,
//             value: 500,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 2 } })
//         if (!checkMatrixTable) {
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             2,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               2
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 2,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 12,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 12, } })
//           if (!transactionCheck) {
//             console.log('work');
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 6 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 12,
//               value: 1000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 2:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 21, } })
//         if (!transactionCheck) {
//           let update = { balance: `${(+user.balance) + 500}.00000000` };
//           await User.update(update, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 21,
//             value: 500,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 22, } })
//         if (!transactionCheck) {
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let update = { count: matrixTable.count + 1 }
//           await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 22,
//             value: 500,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 23, } })
//         if (!transactionCheck) {
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let update = { count: matrixTable.count + 1 }
//           await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 23,
//             value: 500,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 3 } })
//         if (!checkMatrixTable) {
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let update = { count: matrixTable.count + 1 }
//           await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             3,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               3
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 3,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 24,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 24, } })
//           if (!transactionCheck) {
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateMatrix = { count: matrixTable.count + 1 }
//             await Matrix_TableSecond.update(updateMatrix, { where: { id: matrixTable.id } })
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 24,
//               value: 1000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 3:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 31, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 1000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 2 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 31,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 32, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 1000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 2 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 32,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 33, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 1000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 2 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 500}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 33,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 4 } })
//         if (!checkMatrixTable) {
//           let updateBalance = { balance: `${(+user.balance) + 1000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 2 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 500}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             4,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               4
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 4,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 34,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 34, } })
//           if (!transactionCheck) {
//             let updateBalance = { balance: `${(+user.balance) + 1000}.00000000` };
//             await User.update(updateBalance, { where: { id: user.id } });
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateCount = { count: matrixTable.count + 2 }
//             await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//             const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//             if (matrixPegasCheckReferal){
//               const referalUser = await User.findOne({where:{id:user.referal_id}})
//               let updateBalanceReferal = {balance: `${(+referalUser.balance) + 500}.00000000`}
//               await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//             }
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 34,
//               value: 1000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 4:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 41, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 2000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 4 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 41,
//             value: 2000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 42, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 2000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 4 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 42,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 43, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 2000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 4 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 43,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 5 } })
//         if (!checkMatrixTable) {
//           let updateBalance = { balance: `${(+user.balance) + 2000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 4 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             5,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               5
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 5,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 44,
//             value: 2000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 44, } })
//           if (!transactionCheck) {
//             let updateBalance = { balance: `${(+user.balance) + 2000}.00000000` };
//             await User.update(updateBalance, { where: { id: user.id } });
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateCount = { count: matrixTable.count + 4 }
//             await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//             const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//             if (matrixPegasCheckReferal){
//               const referalUser = await User.findOne({where:{id:user.referal_id}})
//               let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//               await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//             }
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 44,
//               value: 2000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 5:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 51, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 3000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 5 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 51,
//             value: 3000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 52, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 3000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 5 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 52,
//             value: 3000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 53, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 3000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 5 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 53,
//             value: 1000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 6 } })
//         if (!checkMatrixTable) {
//           let updateBalance = { balance: `${(+user.balance) + 3000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 5 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             6,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               6
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 6,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 54,
//             value: 3000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 54, } })
//           if (!transactionCheck) {
//             let updateBalance = { balance: `${(+user.balance) + 3000}.00000000` };
//             await User.update(updateBalance, { where: { id: user.id } });
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateCount = { count: matrixTable.count + 5 }
//             await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//             const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//             if (matrixPegasCheckReferal){
//               const referalUser = await User.findOne({where:{id:user.referal_id}})
//               let updateBalanceReferal = {balance: `${(+referalUser.balance) + 1000}.00000000`}
//               await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//             }
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 54,
//               value: 3000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 6:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 61, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 5000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 10 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 61,
//             value: 5000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 62, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 5000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 10 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 62,
//             value: 5000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 63, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 5000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 10 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 2000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 63,
//             value: 5000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 7 } })
//         if (!checkMatrixTable) {
//           let updateBalance = { balance: `${(+user.balance) + 5000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 10 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 2000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             7,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               7
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 7,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 64,
//             value: 5000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 64, } })
//           if (!transactionCheck) {
//             let updateBalance = { balance: `${(+user.balance) + 5000}.00000000` };
//             await User.update(updateBalance, { where: { id: user.id } });
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateCount = { count: matrixTable.count + 10 }
//             await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//             const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//             if (matrixPegasCheckReferal){
//               const referalUser = await User.findOne({where:{id:user.referal_id}})
//               let updateBalanceReferal = {balance: `${(+referalUser.balance) + 2000}.00000000`}
//               await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//             }
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 64,
//               value: 5000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 7:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 71, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 7000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 8 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 71,
//             value: 7000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 72, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 7000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 8 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 72,
//             value: 7000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 73, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 7000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 8 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 3000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 73,
//             value: 7000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 8 } })
//         if (!checkMatrixTable) {
//           let updateBalance = { balance: `${(+user.balance) + 7000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 8 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 3000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             8,
//             referalId,
//             user.id
//           );
//           console.log('dsadas');
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               8
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });

//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 8,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 74,
//             value: 7000,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 74, } })
//           if (!transactionCheck) {
//             let updateBalance = { balance: `${(+user.balance) + 7000}.00000000` };
//             await User.update(updateBalance, { where: { id: user.id } });
//             const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//             let updateCount = { count: matrixTable.count + 8 }
//             await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//             const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//             if (matrixPegasCheckReferal){
//               const referalUser = await User.findOne({where:{id:user.referal_id}})
//               let updateBalanceReferal = {balance: `${(+referalUser.balance) + 3000}.00000000`}
//               await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//             }
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 74,
//               value: 7000,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 8:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 81, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 15000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 30 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 81,
//             value: 15000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 82, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 15000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 30 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 82,
//             value: 15000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 83, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 15000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 30 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 5000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 83,
//             value: 15000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 9 } })
//         if (!checkMatrixTable) {
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             9,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               9
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });
//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 9,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 84,
//             value: 0,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 84, } })
//           if (!transactionCheck) {
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 84,
//               value: 0,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 9:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 91, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 20000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 91,
//             value: 20000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 92, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 20000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 92,
//             value: 20000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 93, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 15000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 5000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 93,
//             value: 20000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 10 } })
//         if (!checkMatrixTable) {
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             10,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               10
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });
//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 10,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 94,
//             value: 0,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 94, } })
//           if (!transactionCheck) {
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 94,
//               value: 0,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 10:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 101, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 25000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 101,
//             value: 25000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 102, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 25000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 102,
//             value: 25000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 103, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 20000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 5000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 103,
//             value: 20000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 11 } })
//         if (!checkMatrixTable) {
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             11,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               11
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });
//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 11,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 104,
//             value: 0,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 104, } })
//           if (!transactionCheck) {
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 104,
//               value: 0,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 11:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 111, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 30000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 111,
//             value: 30000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 112, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 30000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 112,
//             value: 30000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 113, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 25000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
//           if (matrixPegasCheckReferal){
//             const referalUser = await User.findOne({where:{id:user.referal_id}})
//             let updateBalanceReferal = {balance: `${(+referalUser.balance) + 5000}.00000000`}
//             await User.update(updateBalanceReferal, { where: { id: referalUser.id } });
//           }
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 113,
//             value: 30000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 12 } })
//         if (!checkMatrixTable) {
//           const referalId = user.referal_id;
//           let parentIdMatrix, side_matrix;
//           const parentIdForCheck = await findParentId(
//             12,
//             referalId,
//             user.id
//           );
//           if (parentIdForCheck) {
//             const resultFuncCheckCountParentId = await checkCountParentId(
//               parentIdForCheck,
//               user.id,
//               12
//             );
//             parentIdMatrix = resultFuncCheckCountParentId.parentId;
//             side_matrix = resultFuncCheckCountParentId.side_matrix;
//           } else {
//             parentIdMatrix = null;
//             side_matrix = null;
//           }
//           const matrixItem = await MatrixSecond.create({
//             date: new Date(),
//             parent_id: parentIdMatrix,
//             userId: user.id,
//             side_matrix,
//           });
//           const matrixTableItem = await Matrix_TableSecond.create({
//             matrixSecondId: matrixItem.id,
//             typeMatrixSecondId: 12,
//             userId: user.id,
//             count: 0,
//           });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 7 место',
//             date_of_transaction: new Date(),
//             position: 6,
//             transaction_type: 114,
//             value: 0,
//             parent_matrix_id: parentId,
//             userId: matrixItem.userId
//           })
//         } else {
//           const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 114, } })
//           if (!transactionCheck) {
//             let update = { count: checkMatrixTable.count + 1 }
//             await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
//             const transaction = await Transaction.create({
//               comment: 'Выплата за 7 место',
//               date_of_transaction: new Date(),
//               position: 6,
//               transaction_type: 114,
//               value: 0,
//               parent_matrix_id: parentId,
//               userId: checkMatrixTable.userId
//             })
//             return transaction
//           }
//         }
//       }
//       break;
//     case 12:
//       if (count >= 4) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 121, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 60000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 4 место',
//             date_of_transaction: new Date(),
//             position: 3,
//             transaction_type: 121,
//             value: 60000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 5) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 122, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 60000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 5 место',
//             date_of_transaction: new Date(),
//             position: 4,
//             transaction_type: 122,
//             value: 60000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count >= 6) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 123, } })
//         if (!transactionCheck) {
//           let updateBalance = { balance: `${(+user.balance) + 60000}.00000000` };
//           await User.update(updateBalance, { where: { id: user.id } });
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 123,
//             value: 60000,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       if (count === 7) {
//         const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 124, } })
//         if (!transactionCheck) {
//           const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
//           let updateCount = { count: matrixTable.count + 12 }
//           await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
//           const transaction = await Transaction.create({
//             comment: 'Выплата за 6 место',
//             date_of_transaction: new Date(),
//             position: 5,
//             transaction_type: 124,
//             value: 0,
//             parent_matrix_id: parentId,
//             userId: user.id
//           })
//         }
//       }
//       break;
//   }
// };

// const findParentId = async (typeMatrix, referalId, userId) => {
//   const temp = await Matrix_TableSecond.findAll({
//     where: { typeMatrixSecondId: typeMatrix },
//   });
//   if (temp.length === 0) {
//     return null;
//   }
//   if (referalId === userId) {
//     return null;
//   }
//   let matrixTableItems = await Matrix_TableSecond.findOne({
//     where: { userId: referalId, typeMatrixSecondId: typeMatrix },
//   });
//   let parentId =
//     matrixTableItems === null ? null : matrixTableItems.matrixSecondId;
//   if (!parentId) {
//     const referalUser = await User.findOne({ where: { id: referalId } });
//     return findParentId(typeMatrix, referalUser.referal_id, referalUser);
//   } else {
//     return parentId;
//   }
// };

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

// const checkCountParentId = async (parentId, userId, typeMatrixSecondId) => {
//   const itemsParentId = await MatrixSecond.findAll({
//     where: { parent_id: parentId },
//   });
//   if (itemsParentId.length > 1) {
//     // const leftItem = itemsParentId[0].userId;
//     // const rightItem = itemsParentId[1].userId;
//     let one = await checkCountParentId(itemsParentId[0].id, userId);
//     let two = await checkCountParentId(itemsParentId[1].id, userId);
//     let countOne = await MatrixSecond.count({
//       where: { parent_id: one.parentId },
//     });
//     let countTwo = await MatrixSecond.count({
//       where: { parent_id: two.parentId },
//     });
//     if (countOne > countTwo) {
//       return one;
//     } else if (countOne < countTwo) {
//       return two;
//     } else {
//       if (one.parentId < two.parentId) {
//         return one;
//       } else {
//         return two;
//       }
//     }
//   } else if (itemsParentId.length > 0) {
//     return { parentId, side_matrix: 1 };
//   } else {
//     return { parentId, side_matrix: 0 };
//   }
// };

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
      marketingCheck.map(async (i) => {
        if (i.count) {
          marketingGiftResult.push(await marketingGift(
            i.count,
            i.parentId,
            typeMatrix
          ));
        }
      })

    }
    return res.json(marketingCheck);
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
        typeMatrixSecondId: matrix_id,
        userId: user.id,
        count: 0,
      });
      const marketingCheck = await marketingCheckCount(parentId);
      let marketingGiftResult = [];
      if (marketingCheck.length > 0) {
        marketingCheck.map(async (i) => {
          if (i.count) {
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
      return res.json({ items: result });
    }
  }
}

module.exports = new MatrixController();