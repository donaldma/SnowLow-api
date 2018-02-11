
export default {

  getPriceAsFloatNumber: function(price: string): number {
    const regexPrice = price.replace(/[^0-9.-]/g, "")

    let priceAsFloatNumber
    if(regexPrice.includes('-')) {
      const splitRegexPrice = regexPrice.split('-')
      priceAsFloatNumber = parseFloat(splitRegexPrice[0])
    } else {
      priceAsFloatNumber = parseFloat(regexPrice)
    }

    return priceAsFloatNumber
  }
}