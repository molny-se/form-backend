import sgMail from '@sendgrid/mail'
import { env } from './env'

export async function sendgrid(email: string, object: any): Promise<TriggerResult> {
  const sendgridApiKey = env.SENDGRID__API_KEY

  if (sendgridApiKey) {
    sgMail.setApiKey(sendgridApiKey);
    const message = Object.keys(object).map((key => `${key}: ${object[key]}`)).join('\n\n')

    var mailOptions = {
      from: '"Example Team" <from@example.com>',
      to: email,
      subject: `Post av ${object.name}`,
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
  } else {
    return {
      id: 'mailtrap',
      status: 'skipped'
    }
  }
}
