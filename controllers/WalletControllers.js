const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const freekassa = require("freekassa-node");

const { User } = require("../models/models");

class WalletControllers {
  async freeKassa(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const decodeToken = jwt_decode(token);
    const user = await User.findOne({
      where: { username: decodeToken.username },
    });
    const { amount } = req.body;

    const result = freekassa(
      {
          m: "23862",
          oa: amount,
          i:'',
          currency: "RUB",
          em:'',
          pay:'PAY',
          phone:'',
          o: user.username
          
      },
      ".B(n//X{-QAdW}@"
    );
    return res.json(result);
  }
  async payeer(req, res, next) {
    // const { authorization } = req.headers;
    // const token = authorization.slice(7);
    // const decodeToken = jwt_decode(token);
    // const user = await User.findOne({
    //   where: { username: decodeToken.username },
    // });
    // // const iv = 'Ut enim ad minim veniam, quis no';
    // const  amountReq  = req.body.amount;
    // // const formatter = new Intl.NumberFormat('ru-RU', {
    // //   style:'currency',
    // //   currency:'RUB'
    // // })
    // const amount = `${amountReq}.00`
    // const shopId = 1760259497;
    // const secretKey = 'rBZKIamz2v3JCKLz';
    // const orderId = user.username;
    // // const orderId = '111'
    // const currency = "RUB";
    // const callbackUrls = {
    //   success_url: "https://xlife.host/api/wallet/success",
    //   fail_url: "https://xlife.host/api/wallet/error",
    //   status_url: "https://xlife.host/api/wallet/warning",
    // };
    // // const wordArray = CryptoJS.enc.Utf8.parse(`Order ID: ${orderId}`);
    // // const description = CryptoJS.enc.Base64.stringify(wordArray);
    // const description = '0J7Qv9C70LDRgtCwINC00LvRjyDQvNCw0LPQsNC30LjQvdCwIHgtbGlmZQ=='
    // console.log(description);
    // const hash = [shopId, orderId, amount, currency, description];
    // // const key = CryptoJS.MD5(secretKey + orderId);
    // // const cipher = new Rijndael(key, 'cbc');
    // // const ciphertext = Buffer.from(cipher.encrypt(urls, 256, iv));
    // // ciphertext.toString("base64");
    // // const urls = JSON.stringify(callbackUrls);
    // // const params = encodeURIComponent(ciphertext);
    // hash.push(secretKey);
    // // const sign = (CryptoJS.SHA256(hash.join(':'))).words.toString(CryptoJS.enc.Utf8).toUpperCase();
    // const sign = (sha256(hash.join(':'))).toUpperCase()
    // // .update(hash.join(':'))
    // // .hex('')
    // // .toUpperCase();
    // // .toString(CryptoJS.enc.Utf8)
    // // .words.toUpperCase()
    // // console.log(sha256Two(hash.join(':')));
    // console.log(sign); 
    // console.log(amount); 

    // const queryParams = {
    //   m_shop: shopId,
    //   m_orderid: orderId,
    //   m_amount: amount,
    //   m_curr: currency,
    //   m_desc: description,
    //   m_sign: sign,
    //   // m_params: params,
    //   m_process: "send",
    // };

    // return res.json({
    //   url: `https://payeer.com/merchant/?${stringify(queryParams)}`,
    // });
  }
  async redirect(req, res, next) {
    const url = "https://x-life.host/leader";
    return res.redirect(url);
  }
}

module.exports = new WalletControllers();
