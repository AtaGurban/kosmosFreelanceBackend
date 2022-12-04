const { fn, col } = require("sequelize");
const { Op } = require("sequelize");

const ChartControllers = require("../controllers/ChartControllers");
const {
  BalanceCrypto,
} = require("../models/TablesExchange/tableBalanceCrypto");
const { Chart } = require("../models/TablesExchange/tableChart");
const {
  HistoryBargain,
} = require("../models/TablesExchange/tableHistoryBargain");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSale } = require("../models/TablesExchange/tableOrderSale");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");

function subtractYears(numOfYears, date = new Date()) {
  date.setFullYear(date.getFullYear() - numOfYears);
  return date;
}
const transactionCryptoSale = async (
  firstUser,
  secondUser,
  order,
  marketId
) => {
  const pair = await Market.findOne({ where: { id: marketId } });
  const [firstCoin, secondCoin] = pair.split("_");
  const firstCoinWalletSaleUser = await BalanceCrypto.findOne({
    where: { userId: firstUser, walletId: firstCoin },
  });
  const secondCoinWalletSaleUser = await BalanceCrypto.findOne({
    where: { userId: firstUser, walletId: secondCoin },
  });
  const firstCoinWalletSellUser = await BalanceCrypto.findOne({
    where: { userId: secondUser, walletId: firstCoin },
  });
  const secondCoinWalletSellUser = await BalanceCrypto.findOne({
    where: { userId: secondUser, walletId: secondCoin },
  });
  let updatefirstCoinWalletSaleUser = {
    unconfirmed_balance:
      firstCoinWalletSaleUser.unconfirmed_balance - totalWithCom,
  };
  await BalanceCrypto.update(updatefirstCoinWalletSaleUser, {
    where: { id: firstCoinWalletSaleUser.id },
  });
  let updatesecondCoinWalletSaleUser = {
    balance: secondCoinWalletSaleUser.balance + amount,
  };
  await BalanceCrypto.update(updatesecondCoinWalletSaleUser, {
    where: { id: secondCoinWalletSaleUser.id },
  });
  // let updatefirstCoinWalletSellUser = {balance:firstCoinWalletSellUser.balance + }
  let updatesecondCoinWalletSellUser;
};

const sochetStartChart = async (socket, update, pair) => {
  if (!update) {
    try {
        socket.on("chart_date", async (data) => {
            const { command, currencyPair, start, end, period } = data;
            const allData = await ChartControllers.list(
              command,
              currencyPair,
              start,
              end,
              period
            );
            socket.join(data.pair);
            socket.to(data.pair).emit("get_chart_data", allData);
          });
    } catch (error) {
        console.log(error);
    }

  }

  if (update) {
    try {
        fsdf
        const allData = await ChartControllers.list(
            "returnChartData",
            pair,
            +subtractYears(1),
            +new Date(),
            86400
          );
          dsds;
          socket.to(pair).emit("get_chart_data", allData);
          console.log("dsds");
    } catch (error) {
        console.log(error);
    }

  }
};

const OrderClose = async (
  orders,
  amount,
  orderType,
  userId,
  marketId,
  allCom,
  all,
  price
) => {
  if (orderType === "buy") {
    orders.sort((a, b) => {
      return b.price - a.price;
    });
  } else {
    orders.sort((a, b) => {
      return a.price - b.price;
    });
  }
  const io = require("./io.js").get();
  const pairName = await Market.findOne({ where: { id: marketId } });
  let amountTemp = amount;
  for (let i = 0; i < orders.length; i++) {
    const element = orders[i];
    if (+amountTemp >= +element.amount && +amountTemp > 0) {
      //History
      if (orderType !== "buy") {
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "buy",
          rate: element.amount,
          amount: element.amount,
          total: all,
          totalWithCom: allCom,
          price: element.price,
          userId,
          orderSaleId: element.id,
        });
        io.on("connection", async (socket) => {
          await sochetStartChart(socket, true, pairName.pair);
        });
      } else {
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "sell",
          rate: element.amount,
          amount: element.amount,
          total: all,
          totalWithCom: allCom,
          price: element.price,
          userId,
          orderSellId: element.id,
        });
        io.on("connection", async (socket) => {
          await sochetStartChart(socket, true, pairName.pair);
        });
      }
      const totalAmount = await HistoryBargain.findAll({
        attributes: ["tradeID", [fn("sum", col("total")), "total_amount"]],
        group: ["tradeID"],
        raw: true,
        where: {
          tradeID: marketId,
          date: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) },
        },
      });
      //Chart
      // const chartItem = await Chart.create({
      //     date:(+new Date()),
      //     high: i.price,

      // })
      //Market
      const marketForUpdate = await Market.findOne({ where: { id: marketId } });
      const marketUpdate = {
        high24hr: element.price,
        last: element.price,
        baseVolume: totalAmount[0].total_amount,
        percentChange: (element.price * 100) / marketForUpdate.high24hr,
      };
      await Market.update(marketUpdate, { where: { id: marketId } });
      amountTemp = amountTemp - element.amount;
      await element.destroy();
      if (orders.length === i + 1 && +amountTemp > 0) {
        if (orderType === "buy") {
          const item = await OrderSale.create({
            amount: amountTemp,
            price: price,
            marketId,
            userId,
            summ: +amountTemp * +price * 1.02,
            sumWithOutCom: +amountTemp * +price,
          });
        } else {
          const item = await OrderSell.create({
            amount: amountTemp,
            price: price,
            marketId,
            userId,
            summ: +amountTemp * +price * 0.98,
            sumWithOutCom: +amountTemp * +price,
          });
        }
      }
    } else {
      if (orderType !== "buy") {
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "buy",
          rate: element.amount,
          amount: element.amount,
          total: allCom,
          price: element.price,
          totalWithCom: allCom,
          userId,
          orderSaleId: element.id,
        });
        io.on("connection", async (socket) => {
          await sochetStartChart(socket, true, pairName.pair);
        });
        let update = {
          amount: (+element.amount - +amountTemp).toFixed(10),
          summ:
            (+element.amount - amountTemp).toFixed(10) * +element.price * 0.98,
          sumWithOutCom:
            (+element.amount - amountTemp).toFixed(10) * +element.price,
        };
        await OrderSale.update(update, { where: { id: element.id } });
      } else {
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "sell",
          rate: element.amount,
          amount: element.amount,
          total: allCom,
          price: element.price,
          totalWithCom: allCom,
          userId,
          orderSaleId: element.id,
        });
        io.on("connection", async (socket) => {
          await sochetStartChart(socket, true, pairName.pair);
        });
        let update = {
          amount: (+element.amount - +amountTemp).toFixed(10),
          summ:
            (+element.amount - amountTemp).toFixed(10) * +element.price * 1.02,
          sumWithOutCom:
            (+element.amount - amountTemp).toFixed(10) * +element.price,
        };
        await OrderSell.update(update, { where: { id: element.id } });
      }
      const totalAmount = await HistoryBargain.findAll({
        attributes: ["tradeID", [fn("sum", col("total")), "total_amount"]],
        group: ["tradeID"],
        raw: true,
        where: {
          tradeID: marketId,
          date: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) },
        },
      });
      const marketForUpdate = await Market.findOne({ where: { id: marketId } });
      const marketUpdate = {
        high24hr: element.price,
        baseVolume: totalAmount[0].total_amount,
        percentChange: (element.price * 100) / marketForUpdate.high24hr,
      };
      await Market.update(marketUpdate, { where: { id: marketId } });
      amountTemp = 0;
    }
  }
  return true;
};

module.exports = { OrderClose, sochetStartChart };
