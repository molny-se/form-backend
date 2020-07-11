import axios from 'axios'
import { createMessage, createSubject } from './helpers'

async function push(url: string, data: object) {
  const result = await axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    url,
    data,
  })
  return result
}

export async function gotify(email: string, server: string, token: string, object: any): Promise<TriggerResult> {
  const url = `${server}/message?token=${token}`;
  const message = createMessage(object)
  const bodyFormData = {
    title: createSubject(object),
    message,
    priority: 5,
  };

  const result = await push(url, bodyFormData)
  return {
    id: 'gotify',
    status: 'ok',
    data: result.data
  }
}
