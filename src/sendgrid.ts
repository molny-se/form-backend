import sgMail from '@sendgrid/mail'
import { env } from './env'
import { createMessage, createSubject } from './helpers'
import mail from '@sendgrid/mail';

export async function sendgrid(email: string, object: any): Promise<TriggerResult> {
  const sendgridApiKey = env.SENDGRID__API_KEY

  if (sendgridApiKey) {
    try {
      sgMail.setApiKey(sendgridApiKey);
      const message = createMessage(object)
      const subject = createSubject(object)
      const mailOptions = {
        from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
        to: email,
        subject,
        text: message,
      };
  
      const res = await sgMail.send(mailOptions);
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
