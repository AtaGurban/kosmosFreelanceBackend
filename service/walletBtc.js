const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const bip32utils = require('bip32-utils')
const axios = require('axios')
 

module.exports = async ()=>{
//     let mnemonic = 'glove remain drastic talk snack early kingdom normal town inch play tortoise'
//     let seed = bip39.mnemonicToSeedSync(mnemonic)
    
//     let m = bitcoin.HDNode.fromSeedHex(seed)
//     var i = m.deriveHardened(0)
//     var external = i.derive(0)
//     var internal = i.derive(1)
//     var account = new bip32utils.Account([
//     new bip32utils.Chain(external.neutered()),
//     new bip32utils.Chain(internal.neutered())
//     ])
 
//     console.log(account.getChainAddress(0))
     
// account.nextChainAddress(0)
// account.nextChainAddress(1)
const xpub = 'xpub6DNx6nxLqRi4TCPQd9SM3q3eYLzBy74teRTn86Bgw3HA7uKGjmU21nUnBRjreu9atVsV1FaFo6pGeE9nuQNfbrt5Yn7ywTWBZxwxRY1u1K3'
const callback = 'https://tmcoder.store'
const key = '2b196e1e-3c86-4c34-8e3a-751d5395ca37'
const url = `https://api.blockchain.info/v2/receive?xpub=${xpub}&callback=${callback}&key=[${key}]`
const { data } = await axios.get(url)
  
console.log(data)
}  