import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import express from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prismaClient.js'


const routers = express.Router()

routers.post('/addNewUser', async(req, res) => {
    const {userName, passWord} = req.body
    const hashPass = bcrypt.hashSync(passWord, 8)

    const existUser = await prisma.user.findUnique({where:{username:userName}})

    if(existUser){
        return res.send('user found please login')
    }

    try{
        const newTodo = 'add new todo'
        const addUser = await prisma.user.create({data:{username:userName, password:hashPass}})

        const newTodos = await prisma.todo.create({data:{task:newTodo, userId:addUser.id}})

        const token = jwt.sign({id:addUser.id}, process.env.JWT_TOKEN, {expiresIn:'24h'})
        return res.json({token})
    } catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
})


routers.post('/login', async(req, res) => {
    const {userName, password} = req.body

    try{
        const fetchUser = await prisma.user.findUnique({where:{username:userName}})
        if (!fetchUser) { return res.status(404).send({ message: "User not found" }) }

         const passValid = bcrypt.compareSync(password, fetchUser.password)
         if (!passValid) { return res.status(401).send({ message: "Invalid password" })}

        const token = jwt.sign({id: fetchUser.id}, process.env.JWT_TOKEN, {expiresIn:'24h'})
        res.json({ token })
    } catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default routers
