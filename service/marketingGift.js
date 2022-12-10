const {
    User,
    MatrixSecond,
    Matrix_TableSecond,
    Transaction,
  } = require("../models/models");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { findParentId } = require("./findParentId");


module.exports = async (count, parentId, typeMatrix) => {
    const matrixTableData = await MatrixSecond.findOne({
      where: { id: parentId },
    });
    const user = await User.findOne({ where: { id: matrixTableData.userId } });
    const walletRUBId = await Wallet.findOne({ where: { name: 'RUR' } })
    const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
            userId: user.id,
            walletId: walletRUBId.id
        }
    })
    switch (typeMatrix) {
      case 1:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 11, } })
          if (!transactionCheck) {
            let update = { balance: (+walletRUBBalance.balance) + 500 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 11,
              value: 500,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 2 } })
          if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
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
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 2,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 12,
              value: 1000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 12, } })
            if (!transactionCheck) {
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 6 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 12,
                value: 1000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 2:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 21, } })
          if (!transactionCheck) {
            let update = { balance: (+walletRUBBalance.balance) + 500 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 21,
              value: 500,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 22, } })
          if (!transactionCheck) {
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let update = { count: matrixTable.count + 1 }
            await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 22,
              value: 500,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 23, } })
          if (!transactionCheck) {
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let update = { count: matrixTable.count + 1 }
            await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 23,
              value: 500,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 3 } })
          if (!checkMatrixTable) {
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let update = { count: matrixTable.count + 1 }
            await Matrix_TableSecond.update(update, { where: { id: matrixTable.id } })
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              3,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                3
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 3,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 24,
              value: 1000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 24, } })
            if (!transactionCheck) {
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateMatrix = { count: matrixTable.count + 1 }
              await Matrix_TableSecond.update(updateMatrix, { where: { id: matrixTable.id } })
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 24,
                value: 1000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 3:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 31, } })
          if (!transactionCheck) {
            let update = { balance: (+walletRUBBalance.balance) + 1000 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 2 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 31,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 32, } })
          if (!transactionCheck) {
            let update = { balance: (+walletRUBBalance.balance) + 1000 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 2 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 32,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 33, } })
          if (!transactionCheck) {
            let update = { balance: (+walletRUBBalance.balance) + 1000 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 2 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                }
            })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 500 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 33,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 4 } })
          if (!checkMatrixTable) {
            let update = { balance: (+walletRUBBalance.balance) + 1000 };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 2 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                }
            })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 500 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              4,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                4
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 4,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 34,
              value: 1000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 34, } })
            if (!transactionCheck) {
              let updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
              await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateCount = { count: matrixTable.count + 2 }
              await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
              const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
              if (matrixPegasCheckReferal){
                const referalUser = await User.findOne({where:{id:user.referal_id}})
                const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                  where: {
                      userId: referalUser.id,
                      walletId: walletRUBId.id
                  }
                })
                let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 500 };
                await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
              }
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 34,
                value: 1000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 4:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 41, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 4 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 41,
              value: 2000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 42, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 4 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 42,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 43, } })
          if (!transactionCheck) {

            let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 4 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                }
              })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 500 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 43,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 5 } })
          if (!checkMatrixTable) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 4 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 1000 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              5,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                5
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 5,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 44,
              value: 2000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 44, } })
            if (!transactionCheck) {
              let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
              await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateCount = { count: matrixTable.count + 4 }
              await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
              const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
              if (matrixPegasCheckReferal){
                const referalUser = await User.findOne({where:{id:user.referal_id}})
                const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                  where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                    }
                  })
                let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 1000 };
                await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
              }
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 44,
                value: 2000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 5:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 51, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 3000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 5 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 51,
              value: 3000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 52, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 3000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 5 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 52,
              value: 3000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 53, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 3000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 5 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 1000 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 53,
              value: 1000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 6 } })
          if (!checkMatrixTable) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 3000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 5 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 1000 };
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              6,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                6
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 6,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 54,
              value: 3000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 54, } })
            if (!transactionCheck) {
              let updateBalance = { balance: (+walletRUBBalance.balance) + 3000 };
              await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateCount = { count: matrixTable.count + 5 }
              await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
              const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
              if (matrixPegasCheckReferal){
                const referalUser = await User.findOne({where:{id:user.referal_id}})
                const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                  where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                    }
                  })
                let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 1000 };
                await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
              }
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 54,
                value: 3000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 6:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 61, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 10 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 61,
              value: 5000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 62, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });            
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 10 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 62,
              value: 5000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 63, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });            
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 10 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 2000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 63,
              value: 5000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 7 } })
          if (!checkMatrixTable) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 10 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 2000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              7,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                7
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 7,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 64,
              value: 5000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 64, } })
            if (!transactionCheck) {
              let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
              await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateCount = { count: matrixTable.count + 10 }
              await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
              const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
              if (matrixPegasCheckReferal){
                const referalUser = await User.findOne({where:{id:user.referal_id}})
                const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                  where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                    }
                  })
                let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 2000};
                await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
              }
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 64,
                value: 5000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 7:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 71, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 7000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 8 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 71,
              value: 7000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 72, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 7000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 8 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 72,
              value: 7000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 73, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 7000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 8 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 3000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 73,
              value: 7000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 8 } })
          if (!checkMatrixTable) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 7000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 8 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 3000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              8,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                8
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
  
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 8,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 74,
              value: 7000,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 74, } })
            if (!transactionCheck) {
              let updateBalance = { balance: (+walletRUBBalance.balance) + 7000};
              await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
              const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
              let updateCount = { count: matrixTable.count + 8 }
              await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
              const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
              if (matrixPegasCheckReferal){
                const referalUser = await User.findOne({where:{id:user.referal_id}})
                const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                  where: {
                    userId: referalUser.id,
                    walletId: walletRUBId.id
                    }
                  })
                let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 3000};
                await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
              }
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 74,
                value: 7000,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 8:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 81, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 15000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 30 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 81,
              value: 15000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 82, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 15000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 30 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 82,
              value: 15000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 83, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 15000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 30 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 5000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 83,
              value: 15000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 9 } })
          if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              9,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                9
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 9,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 84,
              value: 0,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 84, } })
            if (!transactionCheck) {
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 84,
                value: 0,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 9:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 91, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 20000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 91,
              value: 20000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 92, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 20000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 92,
              value: 20000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 93, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 15000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 5000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 93,
              value: 20000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 10 } })
          if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              10,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                10
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 10,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 94,
              value: 0,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 94, } })
            if (!transactionCheck) {
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 94,
                value: 0,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 10:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 101, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 25000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 101,
              value: 25000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 102, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 25000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 102,
              value: 25000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 103, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 20000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 5000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 103,
              value: 20000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 11 } })
          if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              11,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                11
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 11,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 104,
              value: 0,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 104, } })
            if (!transactionCheck) {
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 104,
                value: 0,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 11:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 111, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 30000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 111,
              value: 30000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 112, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 30000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 112,
              value: 30000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 113, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 25000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const matrixPegasCheckReferal = await Matrix_TableSecond.findOne({where:{userId:user.referal_id}})
            if (matrixPegasCheckReferal){
              const referalUser = await User.findOne({where:{id:user.referal_id}})
              const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                where: {
                  userId: referalUser.id,
                  walletId: walletRUBId.id
                  }
                })
              let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 5000};
              await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
            }
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 113,
              value: 30000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const checkMatrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 12 } })
          if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentIdMatrix, side_matrix;
            const parentIdForCheck = await findParentId(
              12,
              referalId,
              user.id
            );
            if (parentIdForCheck) {
              const resultFuncCheckCountParentId = await checkCountParentId(
                parentIdForCheck,
                user.id,
                12
              );
              parentIdMatrix = resultFuncCheckCountParentId.parentId;
              side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
              parentIdMatrix = null;
              side_matrix = null;
            }
            const matrixItem = await MatrixSecond.create({
              date: new Date(),
              parent_id: parentIdMatrix,
              userId: user.id,
              side_matrix,
            });
            const matrixTableItem = await Matrix_TableSecond.create({
              matrixSecondId: matrixItem.id,
              typeMatrixSecondId: 12,
              userId: user.id,
              count: 0,
            });
            const transaction = await Transaction.create({
              comment: 'Выплата за 7 место',
              date_of_transaction: new Date(),
              position: 6,
              transaction_type: 114,
              value: 0,
              parent_matrix_id: parentId,
              userId: matrixItem.userId
            })
          } else {
            const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 114, } })
            if (!transactionCheck) {
              let update = { count: checkMatrixTable.count + 1 }
              await Matrix_TableSecond.update(update, { where: { id: checkMatrixTable.id } })
              const transaction = await Transaction.create({
                comment: 'Выплата за 7 место',
                date_of_transaction: new Date(),
                position: 6,
                transaction_type: 114,
                value: 0,
                parent_matrix_id: parentId,
                userId: checkMatrixTable.userId
              })
              return transaction
            }
          }
        }
        break;
      case 12:
        if (count >= 4) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 121, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 60000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 4 место',
              date_of_transaction: new Date(),
              position: 3,
              transaction_type: 121,
              value: 60000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 5) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 122, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 60000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 5 место',
              date_of_transaction: new Date(),
              position: 4,
              transaction_type: 122,
              value: 60000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count >= 6) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 123, } })
          if (!transactionCheck) {
            let updateBalance = { balance: (+walletRUBBalance.balance) + 60000};
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 123,
              value: 60000,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        if (count === 7) {
          const transactionCheck = await Transaction.findOne({ where: { parent_matrix_id: parentId, transaction_type: 124, } })
          if (!transactionCheck) {
            const matrixTable = await Matrix_TableSecond.findOne({ where: { userId: user.id, typeMatrixSecondId: 1 } })
            let updateCount = { count: matrixTable.count + 12 }
            await Matrix_TableSecond.update(updateCount, { where: { id: matrixTable.id } })
            const transaction = await Transaction.create({
              comment: 'Выплата за 6 место',
              date_of_transaction: new Date(),
              position: 5,
              transaction_type: 124,
              value: 0,
              parent_matrix_id: parentId,
              userId: user.id
            })
          }
        }
        break;
    }
  };