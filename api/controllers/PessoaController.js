const database = require('../models')
const Sequelize = require('sequelize')

const { PessoasServices } = require('../services')
const pessoaServices = new PessoasServices()

class PessoaController {
    static async pegaPessoasAtivas(req, res) {
        try {
            const pessoasAtivas = await pessoasServices.pegaRegistrosAtivos()
            return res.status(200).json(pessoasAtivas)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaTodasAsPessoas(req, res) {
        try {
            const todasAsPessoas = await pessoaServices.pegaTodosOsRegistros()
            return res.status(200).json(todasAsPessoas)
        }catch(error){
            return res.status(500).json(error.message)
        }    
    }

    static async pegaUmaPessoa(req, res) {
        const { id } = req.params
        try{
            const umaPessoa = await pessoasServices.pegaUmRegistro(Number(id))
            return res.status(200).json(umaPessoa)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async criarPessoa(req, res) {
        const novaPessoa = req.body
        try{
            return res.status(200).json(await database.Pessoas.create(novaPessoa))
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async atualizarPessoa(req, res) {
        const novasInfos = req.body
        const { id } = req.params
        try{
            await database.Pessoas.update(novasInfos, {
            where: {
                id: Number(id)
                }
            })
            return res.status(200).json(await database.Pessoas.findOne({
                where: {
                    id: Number(id)
                }
            }))
        }catch(error){
            return status(500).json(error.message)
        }
        
    }

    static async apagaPessoa(req, res) {
        const { id } = req.params
        try{
            await database.Pessoas.destroy( {
                where: {
                    id: Number(id)
                    }
                })
            return res.status(200).json({ mensagem: `id ${id} deletado`})
        }catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async restauraPessoa(req, res) {
        const { id } = req.params
        try{
            await database.Pessoas.restore({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ mensagem: `id ${id} restaurado` })
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaUmaMatricula(req, res) {
        try{
            const { estudanteId, matriculaId } = req.params
            const umaMatricula = await database.Matriculas.findOne({
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            })
            return res.status(200).json(umaMatricula)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async criarMatricula(req, res) {
        const { estudanteId } = req.params
        const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) }
        try{
            const novaMatriculaCriada = await database.Matriculas.create(novaMatricula)
            return res.status(200).json(novaMatriculaCriada)
        }catch(error){
            return res.status(500).json(error.message)
        }
    }

    static async atualizarMatricula(req, res) {
        const novasInfos = req.body
        const { estudanteId, matriculaId } = req.params
        try{
            await database.Matriculas.update(novasInfos, {
            where: {
                id: Number(matriculaId),
                estudante_id: Number(estudanteId)
                }
            })
            const matriculaAtualizada = await database.Matriculas.findOne({
                where: {
                    id: Number(matriculaId)
                }
            })
            return res.status(200).json(matriculaAtualizada)
        }catch(error){
            return status(500).json(error.message)
        }
        
    }

    static async apagaMatricula(req, res) {
        const { estudanteId, matriculaId } = req.params
        try{
            await database.Matriculas.destroy( {
                where: {
                    id: Number(matriculaId)
                    }
                })
            return res.status(200).json({ mensagem: `id ${matriculaId} deletado`})
        }catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaMatricula(req, res) {
        const { estudanteId } = req.params
        try{
            const pessoa = await database.Pessoas.findOne({
                where: {
                    id: Number(estudanteId)
                }
            })
            const matriculas = await pessoa.getAulasMatriculadas()
            return res.status(200).json(matriculas)
        }catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaMatriculaPorTurma(req, res) {
        const { turmaId } = req.params
        try{
            const todasAsMatriculas = await database.Matriculas.findAndCountAll({
                where: {
                    turma_id: Number(turmaId),
                    status: 'confirmado'
                },
                limit: 1,
                order:[['estudante_id', 'ASC']]
            })

            return res.status(200).json(todasAsMatriculas)
        }catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async pegaTurmasLotadas(req, res) {
        const lotacaoTurma = 2
        try{
            const turmasLotadas = await database.Matriculas.findAndCountAll({
                where: {
                    status: 'confirmado'
                },
                attributes:['turma_id'],
                group:['turma_id'],
                having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
            })

            return res.status(200).json(turmasLotadas.count)
        }catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async cancelaPessoa(req, res) {
        const { estudanteId } = req.params
        try{
            await pessoasServices.cancelaPessoaEMatricula(Number(estudanteId))
            return res.status(200).json({ message: `matriculas ${estudanteId} canceladas`})      
        }catch (error){
            return res.status(500).json(error.message)
        }
    }
}

module.exports = PessoaController