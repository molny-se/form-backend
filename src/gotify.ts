import axios from 'axios'

async function push(url: string, data: object) {
  const result = await axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    url,
    data,
  })
  return {
    id: 'gotify',
    status: 'ok',
    data: result.data
  }
}

export async function gotify(email: string, server: string, token: string, object: any): Promise<TriggerResult> {
  var url = `${server}/message?token=${token}`;
  const message = Object.keys(object).map((key => `${key}: ${object[key]}`)).join('\n\n')
  const bodyFormData = {
    title: `Post av ${object.name}`,
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
