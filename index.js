require("dotenv").config();
const fs = require("fs");
const http = require("http");
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
// app.use(express.static(path.resolve(__dirname, "files")))
// app.use('/sign-in',express.static(path.resolve(__dirname, "files")))
// app.use('/leader',express.static(path.resolve(__dirname, "files")))
// app.use('/sign-up',express.static(path.resolve(__dirname, "files")))
// app.use('/finances',express.static(path.resolve(__dirname, "files")))
// app.use('/dashboard',express.static(path.resolve(__dirname, "files")))
// app.use('/news',express.static(path.resolve(__dirname, "files")))
// app.use('/tables',express.static(path.resolve(__dirname, "files")))
// app.use('/personal-table/:id',express.static(path.resolve(__dirname, "files")))
// app.use('/team',express.static(path.resolve(__dirname, "files")))
// app.use('/settings',express.static(path.resolve(__dirname, "files")))
// app.use('/table/:id',express.static(path.resolve(__dirname, "files")))
app.use(ErrorHandlingMiddleware);

const typeMatrixSecondSumm = [
  500, 1000, 1500, 2000, 2500, 3000, 5000, 6000, 8000, 9000, 10000, 12000
]

const writeOffMatrixTableCount = async ()=>{
  const matrices = await models.Matrix_Table.findAll()
  for (let i = 0; i < matrices.length; i++) {
    let updateCount = {count: matrices[i].count - 6}
    await models.Matrix_Table.update(updateCount, {where:{id:matrices[i].id}})
  }
}

// function writeOffMatrixTableCount async(){
//   const matrices = await models.Matrix_Table.findAll()
// }
 
const start = async () => {
  const httpServer = http.createServer(app);
  // const httpsServer = https.createServer(credentials, app);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    httpServer.listen(80, () => console.log(`server started on port 80`));
    // httpsServer.listen(443, () => console.log(`server started on port 443`));
    // app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
    const typeMatrixSecondCount = await models.TypeMatrixSecond.count()
    if (typeMatrixSecondCount === 0){
      for (let i = 0; i < 12; i++) {
        await models.TypeMatrixSecond.create({
          summ:typeMatrixSecondSumm[i]
        })
      } 
    }
    const cloneStatCount = await models.CloneStatSecond.count()
    if (cloneStatCount === 0){
      for (let i = 0; i < 12; i++) {
        await models.CloneStatSecond.create({
          count: 0,
          level: i + 1
        }) 
      }
    }
    setInterval(writeOffMatrixTableCount, 2000);
  } catch (error) {
    console.log(error);
  }
}; 

start();
