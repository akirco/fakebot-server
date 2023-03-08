import * as dotenv from 'dotenv'
import type { Config } from '../types'
dotenv.config({ path: '.env' })

const config: Config = {
  socket: process.env['SOCKET'] || '*',
  port: +(process.env['PORT'] || 3000),
  host: process.env['HOST'] || '127.0.0.1',
  jwtSecret: process.env['JWT_SECRET'] || '',
  tianApiKey: process.env['TIAN_APIKey'] || '',
  openaikey: process.env['OPENAI_API_KEY'] || '',
  cronJob: process.env['CRON_JOB'] || '0 * * * *',
  mongodb: {
    url: process.env['DATABASER_URL'] || '',
    source: process.env['DATABASE_NAME'] || '',
    maxpool: +(process.env['DATABASE_MAX_POOL'] || 10),
    user: process.env['DATABASE_AUTH_USER'] || '',
    pass: process.env['DATABASE_AUTH_PASS'] || '',
  },
}

export { config }
