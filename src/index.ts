import { RequestHandler, send, json } from 'micro'
import { router, post, AugmentedRequestHandler } from 'microrouter'
import { env } from './env'
import { sendgrid } from './sendgrid'
import { gotify } from './gotify'

const email = env.EMAIL
const gotifyServer = env.GOTIFY__SERVER
const gotifyToken = env.GOTIFY__TOKEN

const requiredFields = ['message']
if (env.REQUIRED_FIELDS) {
  const extraRequiredFields = env.REQUIRED_FIELDS.split(',').map((f: string) => f.trim())
  extraRequiredFields.forEach((field: any) => requiredFields.push(field))
}

async function trigger(object: any) {
  const results: TriggerResult[] = []
  if (email) {
    const result: TriggerResult = await sendgrid(email, object)
    results.push(result)
  }
  console.log('gotify', gotifyServer, gotifyToken)
  if (gotifyServer && gotifyToken) {
    const result = await gotify(email, gotifyServer, gotifyToken, object)
    results.push(result)
  }
  return results
}

export const webhook: AugmentedRequestHandler = async (req, res) => {
  const object = await json(req)
  const keys = Object.keys(object)
  if (!requiredFields.every(field => keys.includes(field))) {
    return send(res, 400)
  }
  const result = await trigger(object)
  const data = {
    status: 'ok',
    result
  }
  send(res, 200, data)
}

module.exports = router(
  post('/trigger', webhook)
)
