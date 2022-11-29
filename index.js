require("dotenv").config();
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
// const https = require("https");
// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/tmcoder.ru/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/tmcoder.ru/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync(
//   "/etc/letsencrypt/live/tmcoder.ru/chain.pem",
//   "utf8" 
// );  
const express = require("express"); 
const sequelize = require("./db");
const models = require("./models/models");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const app = express();
const { Op } = require("sequelize");
const createFakeMatrices = require("./service/createFakeMatrices");
const { Market } = require("./models/TablesExchange/tableMarket");
const { Coin } = require("./models/TablesExchange/tableCoin");
const coinConst = require("./utils/coinConst");
const exchangeParser = require("./service/exchangeParser");
const exchangeBot = require("./service/exchangeBot");
const walletBtc = require("./service/walletBtc");
const { ChatTable } = require("./models/chatTable");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

app.use(cors());
app.use(express.json());
app.use("/api/user", express.static(path.resolve(__dirname, "files", "images")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(ErrorHandlingMiddleware);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



const typeMatrixSecondSumm = [
  500, 1500, 4000, 7000, 10000, 16000, 20000, 30000, 30000, 90000, 260000, 540000
]

const typeMatrixThirdSumm = [
  150, 300, 600, 1200, 2400, 4400, 8800, 14000, 24000, 38000, 56000, 75000
]

const writeOffMatrixTableCount = async () => {
  const updateStatistic = async (all_comet, all_planet) => {
    let update = { all_comet, all_planet }
    const allItems = await models.Statistic.update(update, { where: { id: { [Op.not]: 0 } } })
  }

  const summColumnStatistic = async () => {
    let resp = await models.Matrix_Table.findAll({
      attributes: [[
        sequelize.fn("sum", sequelize.col(`count`)), "all_count",
      ]]
    })
    return resp
  }

  const updateOrCreate = async function (where, newItem) {
    await models.Statistic.findOne({ where: where }).then(async function (foundItem) {
      (!foundItem) ? (await models.Statistic.create(newItem)) : (await models.Statistic.update(newItem, { where: where }))
    })
  }
  const matrices = await models.Matrix_Table.findAll({where: {count:{[Op.gte]: 6,}}})
  for (let i = 0; i < matrices.length; i++) {
    let updateCount = { count: matrices[i].count - 6 }
    await models.Matrix_Table.update(updateCount, { where: { id: matrices[i].id } })
    await updateOrCreate({ userId: matrices[i].userId }, { my_comet: updateCount.count })
    await createFakeMatrices()
  }
  if (matrices.length > 0){
    const fakeMatrices = await models.Matrix.findAll({where:{matrix_essence:11}})
    for (let j = 0; j < fakeMatrices.length; j++) {
      await models.Matrix.destroy({where:{id:fakeMatrices[j].id}})    
    }
    const allPlanet = await models.Matrix_Table.count()
    const allComet = (await summColumnStatistic())[0].dataValues.all_count
    await updateStatistic(allComet, allPlanet)
  }
}


const start = async () => {
  // const httpServer = http.createServer(app);
  // const httpsServer = https.createServer(credentials, app);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(5000, () => console.log(`server started on port 5000`));
    // httpsServer.listen(443, () => console.log(`server started on port 443`));
    // app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
    const typeMatrixSecondCount = await models.TypeMatrixSecond.count()
    const typeMatrixThirdCount = await models.TypeMatrixThird.count()
    if (typeMatrixSecondCount === 0) {
      for (let i = 0; i < 12; i++) {
        await models.TypeMatrixSecond.create({
          summ: typeMatrixSecondSumm[i]
        })
      }
    }
    if (typeMatrixThirdCount === 0) {
      for (let i = 0; i < 12; i++) {
        await models.TypeMatrixThird.create({
          summ: typeMatrixThirdSumm[i]
        })
      }
    }
    const cloneStatSecondCount = await models.CloneStatSecond.count()
    const cloneStatThirdCount = await models.CloneStatThird.count()
    if (cloneStatSecondCount === 0) {
      for (let i = 0; i < 12; i++) {
        await models.CloneStatSecond.create({ 
          count: 0,
          level: i + 1
        })
      }
    }
    if (cloneStatThirdCount === 0) {
      for (let i = 0; i < 12; i++) {
        await models.CloneStatThird.create({ 
          count: 0,
          level: i + 1
        })
      }
    }
    const coinCount = await Coin.count()
    if (coinCount === 0){
      await sequelize.query(coinConst, {
        type:sequelize.QueryTypes.INSERT
      })
    }
    // const marketCount = await Market.count()
    // if (marketCount === 0){
    //   await exchangeParser() 
    // }

    setInterval(writeOffMatrixTableCount, 2 * 60 * 60 * 1000);
    // setInterval(async ()=>{exchangeParser('all')}, 6 * 60 * 60 * 1000);
    // while (true) {Second
    //   await exchangeParser('top')
    // }

    // walletBtc()
    io.on("connection", async(socket) => {

      socket.on("join_room", (data) => {
        socket.join(data);
      });

      const allMessage = await ChatTable.findAll({include: {model: models.User ,as: "user"}})
      socket.on("join_room", (data) => {
        socket.join(data);
        socket.emit("getOldMessage", allMessage);
      });
      
      socket.on("send_message", async (data) => {
        socket.to(data.room).emit("receive_message", data);
        const item = await ChatTable.create({
          time: data.time, 
          message: data.message,
          author: data.author,
          userId:data.userId
        })
      });
    
      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
    });

  } catch (error) {
    console.log(error);  
  }  
};

start();

