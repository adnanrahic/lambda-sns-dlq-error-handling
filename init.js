'use strict'

const aws = require('aws-sdk')
const sns = new aws.SNS({ region: 'eu-central-1' })

function generateResponse (code, payload) {
  console.log(payload)
  return {
    statusCode: code,
    body: JSON.stringify(payload)
  }
}
function generateError (code, err) {
  console.error(err)
  return generateResponse(code, {
    message: err.message
  })
}
async function publishSnsTopic (data) {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:calculate-topic`
  }
  return sns.publish(params).promise()
}

module.exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  if (typeof data.number !== 'number') {
    return generateError(400, new Error('Invalid number.'))
  }

  try {
    const metadata = await publishSnsTopic(data)
    return generateResponse(200, {
      message: 'Successfully added the calculation.',
      data: metadata
    })
  } catch (err) {
    return generateError(500, new Error('Couldn\'t add the calculation due an internal error. Please try again later.'))
  }
}
