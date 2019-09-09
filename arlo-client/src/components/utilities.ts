import * as Yup from 'yup'
import { CreateAuditParams } from '../types'

export const api = <T>(
  endpoint: string,
  { electionId, ...options }: CreateAuditParams & RequestInit
): Promise<T> => {
  const apiBaseURL = electionId ? `/election/${electionId}` : ''
  return fetch(apiBaseURL + endpoint, options).then(res => {
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    return res.json() as Promise<T>
  })
}

export const poll = (
  condition: () => Promise<boolean>,
  callback: () => any,
  errback: (arg0: Error) => void,
  timeout: number = 120000,
  interval: number = 1000
) => {
  const endTime = Date.now() + timeout
  ;(async function p() {
    const done = await condition()
    if (done) {
      callback()
    } else if (Date.now() < endTime) {
      setTimeout(p, interval)
    } else {
      errback(new Error(`Timed out`))
    }
  })()
}

const numberSchema = Yup.number()
  .typeError('Must be a number')
  .integer('Must be an integer')
  .min(0, 'Must be a positive number')
  .required('Required')

export const testNumber = (max?: number, message?: string) => (value: any) =>
  numberSchema.validate(value).then(
    success => {
      if (max) {
        const schema = Yup.number().test(
          'cap',
          message || `Must be smaller than ${max}`,
          function(v) {
            /* istanbul ignore else */
            if (this.options.context) {
              const { max } = this.options.context as { max: number }
              return v <= max
            } else return true
          }
        )
        return schema
          .validate(value, { context: { max } })
          .then(success => undefined, error => error.errors[0])
      } else return undefined
    },
    error => error.errors[0]
  )

export default api
