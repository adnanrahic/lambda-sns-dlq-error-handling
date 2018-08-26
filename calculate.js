'use strict'

module.exports.handler = async (event) => {
  const { number } = JSON.parse(event.Records[0].Sns.Message)
  const factorial = (x) => x === 0 ? 1 : x * factorial(x - 1)
  const result = factorial(number)

  console.log(`The factorial of ${number} is ${result}.`)
  return result
}
