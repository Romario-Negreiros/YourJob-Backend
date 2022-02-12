import app from './App'
import dotenv from 'dotEnv'
dotenv.config()

app.listen(process.env.PORT || 3333, () => console.log('Server is running'))
