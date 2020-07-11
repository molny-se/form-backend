import mail from '@sendgrid/mail'
import { env } from './env'
import { createMessage, createSubject } from './helpers'

export async function sendgrid(email: string, object: any): Promise<TriggerResult> {
  const sendgridApiKey = env.SENDGRID__API_KEY

  if (sendgridApiKey) {
    try {
      mail.setApiKey(sendgridApiKey);
      const message = createMessage(object)
      const subject = createSubject(object)
      const mailOptions = {
        from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
        to: email,
        subject,
        text: message,
      };
  
      const res = await mail.send(mailOptions);
      return {
        id: 'sendgrid',
        status: 'ok',
        data: {
          statusCode: res[0].statusCode
        }
      }
    } catch (error) {
      return {
        id: 'sendgrid',
        status: 'error',
        data: error.response.body
      }
    }
  } else {
    return {
      id: 'sendgrid',
      status: 'skipped'
    }
  }
}
