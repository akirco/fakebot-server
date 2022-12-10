import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface AppConfig {
  port: number
  jwtSecret: string
  cronJob: string
  host: string
  mongoUrl: string
  tianApiKey: string
}

const config: AppConfig = {
  port: +(process.env['PORT'] || 3000),
  host: process.env['HOST'] || '127.0.0.1',
  mongoUrl: process.env['DATABASER_URL'] || '',
  jwtSecret: process.env['JWT_SECRET'] || '',
  tianApiKey: process.env['TIAN_APIKey'] || '',
  cronJob: process.env['CRON_JOB'] || '0 * * * *',
}

export { config }
