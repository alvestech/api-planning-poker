const express = require("express")
const server = express()
const router = express.Router()
const fs = require('fs')

server.use(express.json({extended: true}))

const lerArquivo = () => {

    const content = fs.readFileSync('./data/items.json', 'utf-8')
    return JSON.parse(content)
}

const escreverArquivo = (content) => {

    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./data/items.json', updateFile, 'utf-8')
}

router.get('/Consultar', (req, res) => {

    const content = lerArquivo()
    res.send(content)
})

router.post('/Adicionar', (req, res) => {

    const { nome, voto, tipo } = req.body
    const currentContent = lerArquivo()
    const id = Math.random().toString(32).substr(2, 9)

    currentContent.push({ id, nome, voto, tipo })
    escreverArquivo(currentContent)

    res.send({ id, nome, voto, tipo })
})

router.put('/Atualizar/:id', (req, res) => {

    const {id} = req.params
    const { nome, voto, tipo } = req.body
    const currentContent = lerArquivo()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    const { id: cId, nome: cnome, voto: cvoto, tipo: ctipo } = currentContent[selectedItem]

    const newObject = {
        id: cId,
        nome: nome ? nome: cnome,
        voto: voto ? voto: cvoto,
        tipo: tipo ? tipo: ctipo,
    }

    currentContent[selectedItem] = newObject
    escreverArquivo(currentContent)

    res.send(newObject)
})

router.delete('/Excluir/:id', (req, res) => {
    const { id } = req.params
    const currentContent = lerArquivo()
    const selectedItem = currentContent.findIndex((item) => item.id === id)

    currentContent.splice(selectedItem, 1)
    escreverArquivo(currentContent)

    res.send(true)
})

server.use(router)

server.listen(3000, () => {
    console.log('*** servidor rodando ***')
})