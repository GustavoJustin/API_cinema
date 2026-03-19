const express = require('express')
const pool = require('./config/database')

const app = express()
app.use(express.json())

const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if(err) reject(err)
            else resolve(results)
        })   
    })
}

app.get('/', (req,res) => {
    res.send("API CINEMA")
})

//-----------------------------------------------------------Filmes-----------------------------------------------------------

app.get('/filmes', async (req,res) => {
    try {
        const filmes = await queryAsync('SELECT * FROM filme')

        res.status(200).json ({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        })

    } catch(erro) {
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao listar livros',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.get('/filmes/:id', async (req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }

        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if (filme.length ==0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        res.status(200).json({
            sucesso: true,
            dados: filme[0]
        })

    } catch(erro) {
        console.error('Erro ao encontrar filme:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao encontrar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.post('/filmes', async(req, res) => {
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!titulo || !genero || !duracao) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Título, genero e duração são obrigatórios'
            })
        }

        if(typeof duracao !== 'number' || duracao <= 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Duração deve ser um número positivo.'
            })
        }

        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao: duracao,
            classificacao: classificacao || null,
            data_lancamento: data_lancamento || null
        } 

        const resultado = await queryAsync('INSERT INTO filme SET ?',[novoFilme])
            
        res.status(201).json ({
            sucesso: true,
            mensagem: 'FIlme cadastrado com sucesso',
            id: resultado.insertId
        })

    } catch (erro) {
        console.log('Erro ao salvar filmes:', erro)

        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao salvar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.put('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])
        
        if(filmeExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Filme não encontrado.'
            })
        }

        const filmeAtualizado = {}

        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao!== undefined) {
            if(typeof duracao != 'number' || duracao <= 0) {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: 'A duração deve ser um número positivo'
                })
            }
            filmeAtualizado.duracao = duracao
        }

        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao
        if(data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento

        if(Object.keys(filmeAtualizado).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id = ?', [filmeAtualizado, id])

        res.status(200).json ({
            sucesso: true,
            mensagem: 'Filme atualizado'
        })

    } catch (erro) {
        console.log('Erro ao atualizar filme', erro)

        return res.status(500) ({
            sucesso: false,
            mensagem: 'Erro ao atualizar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.delete('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        await queryAsync('DELETE FROM filme WHERE id = ? ', [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'Filme apagado'
        })

    } catch (erro) {
        console.log('Erro ao apagar filme')

        return res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao apagar filme',
            erro: erro.message
        })
    }
})





//-----------------------------------------------------------Salas-----------------------------------------------------------

app.get('/salas', async (req,res) => {
    try {
        const salas = await queryAsync('SELECT * FROM sala')

        res.status(200).json ({
            sucesso: true,
            dados: salas,
            total: salas.length
        })

    } catch(erro) {
        console.error('Erro ao listar salas:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.get('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sala inválido'
            })
        }

        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (sala.length ==0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada'
            })
        }

        res.status(200).json({
            sucesso: true,
            dados: sala[0]
        })

    } catch(erro) {
        console.error('Erro ao encontrar sala:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao encontrar sala',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.post('/salas', async(req, res) => {
    try {
        const {nome, capacidade} = req.body

        if(!nome || !capacidade) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Nome e capacidade são obrigatórios'
            })
        }

        if(typeof capacidade !== 'number' || capacidade <= 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Capacidade deve ser um número positivo.'
            })
        }

        const novaSala = {
            nome: nome.trim(),
            capacidade: capacidade,
        } 

        const resultado = await queryAsync('INSERT INTO sala SET ?',[novaSala])
            
        res.status(201).json ({
            sucesso: true,
            mensagem: 'Sala cadastrada com sucesso',
            id: resultado.insertId
        })

    } catch (erro) {
        console.log('Erro ao salvar sala:', erro)

        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao salvar sala',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.put('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {nome, capacidade} = req.body

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        const salaExiste = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])
        
        if(salaExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Sala não encontrado.'
            })
        }

        const salaAtualizada = {}

        if(nome !== undefined) salaAtualizada.nome = nome.trim()
        if(capacidade !== undefined) {
            if(typeof capacidade != 'number' || capacidade <= 0) {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: 'A capacidade deve ser um número positivo'
                })
            }
            salaAtualizada.capacidade = capacidade
        }

        if(Object.keys(salaAtualizada).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE sala SET ? WHERE id = ?', [salaAtualizada, id])

        res.status(200).json ({
            sucesso: true,
            mensagem: 'Sala atualizada'
        })

    } catch (erro) {
        console.log('Erro ao atualizar sala', erro)

        return res.status(500) ({
            sucesso: false,
            mensagem: 'Erro ao atualizar sala',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.delete('/salas/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        const salaExiste = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if(salaExiste.length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        await queryAsync('DELETE FROM sala WHERE id = ? ', [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'Sala apagado'
        })

    } catch (erro) {
        console.log('Erro ao apagar sala')

        return res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao apagar sala',
            erro: erro.message
        })
    }
})





//-----------------------------------------------------------Sessao-----------------------------------------------------------

app.get('/sessao', async (req,res) => {
    try {
        const sessoes = await queryAsync('SELECT * FROM sessao')

        res.status(200).json ({
            sucesso: true,
            dados: sessoes,
            total: sessoes.length
        })

    } catch(erro) {
        console.error('Erro ao listar sessões:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao listar sessões',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.get('/sessao/:id', async (req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de sessão inválido'
            })
        }

        const sessao = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (sessao.length ==0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sessão não encontrado'
            })
        }

        res.status(200).json({
            sucesso: true,
            dados: sessao[0]
        })

    } catch(erro) {
        console.error('Erro ao encontrar sessão', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao encontrar sessão',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.post('/sessao', async(req, res) => {
    try {
        const {filme_id, sala_id, preco} = req.body

        if(!filme_id || !sala_id|| !preco) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Id do filme, id da sala e preço é obrigatórios'
            })
        }

        if(!filme_id || isNaN(filme_id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [filme_id])

        if(filmeExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        if(!sala_id || isNaN(sala_id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        const salaExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [sala_id])

        if(salaExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Sala não encontrado'
            })
        }

        if(typeof preco !== 'number' || preco <= 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Preço deve ser um número positivo.'
            })
        }

        const novaSessao = {
            filme_id: filmeExiste,
            sala_id: salaExiste,
            preco: preco
        } 

        const resultado = await queryAsync('INSERT INTO sessao SET ?',[novaSessao])
            
        res.status(201).json ({
            sucesso: true,
            mensagem: 'Sessão cadastrada com sucesso',
            id: resultado.insertId
        })

    } catch (erro) {
        console.log('Erro ao salvar sessão:', erro)

        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao salvar sessão',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.put('/sessao/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {filme_id, sala_id, preco} = req.body

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        const sessaoExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])
        
        if(sessaoExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Sala não encontrado.'
            })
        }

        if(!filme_id || isNaN(filme_id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'ID sessão inválido'
                })
            }
        
        const filmeExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [filme_id])

        if(filmeExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Sessão não encontrado'
            })
        }
        
        if(sala_id !== undefined) {
            if(!sala_id || isNaN(sala_id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'ID sessão inválido'
                })
            }
        }

        const salaExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [sala_id])

        if(salaExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Sala não encontrado'
            })
        }

        const sessaoAtualizada = {}

        if(filme_id !== undefined) sessaoAtualizada.filme_id = filme_id
        if(sala_id !== undefined) sessaoAtualizada.sala_id = sala_id
        if(preco !== undefined) {
            if(typeof preco != 'number' || preco <= 0) {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: 'O preço deve ser um número positivo'
                })
            }
            sessaoAtualizada.preco = preco
        }

        if(Object.keys(sessaoAtualizada).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE sessao SET ? WHERE id = ?', [sessaoAtualizada, id])

        res.status(200).json ({
            sucesso: true,
            mensagem: 'Sessão atualizada'
        })

    } catch(erro) {
        console.log('Erro ao atualizar sessão', erro)

        return res.status(500) ({
            sucesso: false,
            mensagem: 'Erro ao atualizar sessão',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.delete('/sessao/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sessão inválido'
            })
        }

        const sessaoExiste = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if(sessaoExiste.length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID sessão inválido'
            })
        }

        await queryAsync('DELETE FROM sessao WHERE id = ? ', [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'Sessão apagado'
        })

    } catch (erro) {
        console.log('Erro ao apagar sessão')

        return res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao apagar sessão',
            erro: erro.message
        })
    }
})





//-----------------------------------------------------------Ingressos-----------------------------------------------------------

app.get('/filmes', async (req,res) => {
    try {
        const filmes = await queryAsync('SELECT * FROM filme')

        res.status(200).json ({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        })

    } catch(erro) {
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao listar livros',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.get('/filmes/:id', async (req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme inválido'
            })
        }

        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if (filme.length ==0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        res.status(200).json({
            sucesso: true,
            dados: filme[0]
        })

    } catch(erro) {
        console.error('Erro ao encontrar filme:', erro)
        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao encontrar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.post('/filmes', async(req, res) => {
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!titulo || !genero || !duracao) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Título, genere e duração são obrigatórios'
            })
        }

        if(typeof duracao !== 'number' || duracao <= 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Duração deveser um número positivo.'
            })
        }

        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao: duracao,
            classificacao: classificacao || null,
            data_lancamento: data_lancamento || null
        } 

        const resultado = await queryAsync('INSERT INTO filme SET ?',[novoFilme])
            
        res.status(201).json ({
            sucesso: true,
            mensagem: 'FIlme cadastrado com sucesso',
            id: resultado.insertId
        })

    } catch (erro) {
        console.log('Erro ao salvar filmes:', erro)

        res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao salvar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.put('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])
        
        if(filmeExiste.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'Filme não encontrado.'
            })
        }

        const filmeAtualizado = {}

        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao!== undefined) {
            if(typeof duracao != 'number' || duracao <= 0) {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: 'A duração deve ser um número positivo'
                })
            }
            filmeAtualizado.duracao = duracao
        }

        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao
        if(data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento

        if(Object.keys(filmeAtualizado).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id = ?', [filmeAtualizado, id])

        res.status(200).json ({
            sucesso: true,
            mensagem: 'Filme atualizado'
        })

    } catch (erro) {
        console.log('Erro ao atualizar filme', erro)

        return res.status(500) ({
            sucesso: false,
            mensagem: 'Erro ao atualizar filme',
            erro: erro.message
        })
    }
})

//------------------------------------------------------------------------------------

app.delete('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        await queryAsync('DELETE FROM filme WHERE id = ? ', [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'Filme apagado'
        })

    } catch (erro) {
        console.log('Erro ao apagar filme')

        return res.status(500).json ({
            sucesso: false,
            mensagem: 'Erro ao apagar filme',
            erro: erro.message
        })
    }
})

module.exports = app