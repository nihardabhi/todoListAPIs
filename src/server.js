import express from 'express'
import dotenv from 'dotenv';
import userRoutes from './controllers/usersController.js'
import todoRoutes from './controllers/todoController.js'
import protectionLayer from './authMiddleware/authMiddleares.js';
dotenv.config();

const app = express()

app.use(express.json())


app.use('/auth',userRoutes)
app.use('/todos', protectionLayer, todoRoutes)

app.listen(process.env.PORT, () => {console.log('running now .....')})