import dotenv from 'dotenv'
dotenv.config()

const transporterConfigs = {
  host: 'smtp-mail.outlook.com',
  service: 'hotmail',
  user: 'yourjob.donotreply@outlook.com',
  password: process.env.OUTLOOK_PASSWORD
}

export default transporterConfigs
