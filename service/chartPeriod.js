

module.exports = async (periods) => {
    let result = []
    periods.map((i) => {
        let prices = []
        let volume = 0
        i.periodArr.map((j) => {
            prices.push(+j.price)
            volume = volume + (+j.total)
        })
        let sortedPrices = prices.sort((a, b) => b - a);
        let high = sortedPrices[0]
        let low = sortedPrices[sortedPrices.length - 1]
        result.push({ date: `${i.date}`, open: `${prices[0]}`, close: `${prices[prices.length - 1]}`, high:`${high}`, low:`${low}`, volume:`${volume}` })
    })
    return result   
}