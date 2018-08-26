'use strict'

const AWS = require('aws-sdk')
const sns = new AWS.SNS({ region: 'eu-central-1' })

module.exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  if (typeof data.number !== 'number') {
    console.error('Validation Failed')
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Invalid number.'
    }
  }

  try {
    const params = {
      Message: JSON.stringify(data),
      TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:calculate-topic`
    }
    const res = await sns.publish(params).promise()

    console.log('SNS Stream params: ', params)
    console.log('SNS Response metadata: ', res)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully added the calculation.'
      })
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t add the calculation due an internal error. Please try again later.'
    }
  }
}
