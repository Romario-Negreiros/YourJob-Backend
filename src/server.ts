import app from './App'
import dotenv from 'dotenv'
dotenv.config()

app.listen(process.env.PORT || 3333)
