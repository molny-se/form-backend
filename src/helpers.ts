import { String } from 'typescript-string-operations';
import { env } from './env'

export function createMessage(object: any) {
  return Object.keys(object).map(((key) => `${key}: ${object[key]}`)).join('\n\n')
}

export function createSubject(object: any) {
  return String.Format(env.SUBJECT, object)
}
