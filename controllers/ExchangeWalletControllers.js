const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { testnet, mainnet } = require("bitcore-lib/lib/networks");
const { Op } = require("sequelize");
const { createHDWallet } = require("../service/walletCrypto");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");

const {
    User
  } = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");

BalanceCrypto
  class ExchangeWalletControllers{

      async createBTC(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const decodeToken = jwt_decode(token);
        const user = await User.findOne({
          where: { username: decodeToken.username },
        });
        const walletId = await Wallet.findOne({where:{name:'BTC'}})      
        const balanceCryptoCheck = await BalanceCrypto.findOne({where:{userId:user.id, walletId:walletId.id}})
        if (balanceCryptoCheck){
            return next(ApiError.badRequest("У вас уже есть кошелек"));
        }
        const btcWallet = createHDWallet(mainnet)
        const btcWalletItem = await BalanceCrypto.create({
          xpub:btcWallet.xpub,
          privateKey:btcWallet.privateKey,
          address:btcWallet.address,
          mnemonic:btcWallet.mnemonic,
          userId:user.id,
          walletId: walletId.id
        })
        return res.json(btcWalletItem);
      }
  }

  
module.exports = new ExchangeWalletControllers();