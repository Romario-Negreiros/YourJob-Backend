import app from './App'

const PORT = 3333
app.listen(process.env.PORT || PORT, () => console.log(`Server is running on port: ${PORT}`))
