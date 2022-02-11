import app from './App'
import dotEnv from 'dotEnv'
dotEnv.config()

app.listen(process.env.PORT || 3333, () => console.log('Server is running'))
