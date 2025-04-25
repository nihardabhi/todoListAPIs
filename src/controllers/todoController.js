import express from 'express'
import prisma from '../prismaClient.js'

const routes = express.Router()

routes.get('/getAllTask', async(req, res) => {
    const fetchTodos = await prisma.todo.findMany({where:{userId:req.userId}})
    res.json(fetchTodos)
})

routes.post('/addNewTask', async(req, res) => {
    const {task} = req.body
    console.log(req.body)

    const newTodo = await prisma.todo.create({data:{task, userId:req.userId}})

    res.json(newTodo)
})

routes.put('/updateTask/:id', async(req, res) => {
    const {newCompleted} = req.body
    const {id} = req.params

    const updateTodo = await prisma.todo.update({where:{id:parseInt(id)}, data:{completed: !!newCompleted}})
    res.json(updateTodo)
})

routes.delete('/deleteTask/:id', async(req, res) => {
    const { id } = req.params
    const userId = req.userId
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    res.send({ message: "Todo deleted" })
})


export default routes