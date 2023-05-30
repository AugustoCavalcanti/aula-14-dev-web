const express = require('express')
const db = require('./db')


const app = express()
const roteador = express.Router()

app.use(express.json())
app.use(roteador)


app.get('/ola', (req, res) =>{
    res.json({
        Ola: "mundo"
    })
})

app.get('/tarefas', (req, res) => {
    const query = 'SELECT * FROM tarefas'
    db.all(query, (erro, tarefas) => {
        if (erro == null) {
            res.json(tarefas)
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: 'Ocorreu um erro ao buscar os dados de todas as tarefas'})
        }
    })
})

app.get('/tarefa/:id', (req, res) => {
    const id = req.params.id
    const query = 'SELECT * FROM tarefas WHERE id = ?'
    db.get(query, [id], (erro, tarefa) => {
        if (erro == null) {
            if (tarefa == null) {
                res.status(404).json({ mensagem: 'Tarefa não encontrada' })
            } else {
                res.json(tarefa)
            }
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: 'Ocorreu um erro ao buscar os dados da tarefa: ' + id})
        }
    })
})

app.post('/tarefas', (req, res) => {
    const nome = req.body.nome
    const query = 'INSERT INTO tarefas (nome, feito) VALUES (?, ?)'
    db.run(query, [nome, 0], (erro) => {
        if (erro == null) {
            res.status(201).json({mensagem: 'Tarefa criada com sucesso', id: this.lastID})
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: 'Ocorreu um erro ao cadastrar a tarega' })
        }
    })
})

app.put('/tarefa/:id', (req, res) => {
    const id = req.params.id
    const nome = req.body.nome
    const feito = req.body.feito

    const query = 'UPDATE tarefas SET nome = ?, feito = ? WHERE id = ?'
    db.run(query, [nome, feito, id], (erro) => {
        if (erro == null) {
            res.sendStatus(204)
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: 'Ocorreu um erro ao tentar alterar a tarefa:' + id})
        }
    })
})

app.delete('/tarefa/:id', (req, res) => {
    const id = req.params.id

    const query = 'DELETE FROM tarefas WHERE id = ?'
    db.run(query, [id], (erro) => {
        if (erro == null) {
            res.sendStatus(204)
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: 'Erro ao excluir a tarefa: ' + id })
        }
    })
})

app.listen(3002, () => {
    console.log('Servidor executando em localhost:3002')
})