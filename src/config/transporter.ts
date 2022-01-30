import dotenv from 'dotenv'
dotenv.config()

const transporterConfigs = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  user: 'yourjob.donotreply@gmail.com',
  password: process.env.GMAIL_PASSWORD
}

export default transporterConfigs
