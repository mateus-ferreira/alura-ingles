const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController')

const router = Router()

router
    .get('/pessoas', PessoaController.pegaTodasAsPessoas)
    .get('/pessoas/ativas', PessoaController.pegaPessoasAtivas)
    .get('/pessoas/:id', PessoaController.pegaUmaPessoa)
    .get('/pessoas/:estudanteId/matricula', PessoaController.pegaMatricula)
    .get('/pessoas/matricula/:turmasId/confirmadas', PessoaController.pegaMatriculaPorTurma)
    .get('/pessoas/matricula/lotada', PessoaController.pegaTurmasLotadas)
    .post('/pessoas', PessoaController.criarPessoa)
    .put('/pessoas/:id', PessoaController.atualizarPessoa)
    .delete('/pessoas/:id', PessoaController.apagaPessoa)
    .get('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.pegaUmaMatricula)
    .post('/pessoas/:estudanteId/matricula', PessoaController.criarMatricula)
    .put('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.atualizarMatricula)
    .delete('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.apagaMatricula)
    .post('/pessoas/:id/restaura', PessoaController.restauraPessoa)
    .post('/pessoas/:estudanteId/cancela', PessoaController.cancelaPessoa)

module.exports = router