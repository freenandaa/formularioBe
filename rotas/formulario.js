const { Router } = require("express")
const {getFormularios, getFormulario, postFormulario, postCadastroFormulario, patchFormulario, deleteFormulario, putFormulario } = require("../controladores/formulario")

const router = Router()

router.get('/', getFormularios)

router.get('/:cpf', getFormulario)

router.post('/', postFormulario)

router.post('/cadastro', postCadastroFormulario)

router.patch('/:cpf', patchFormulario)

router.delete('/:cpf', deleteFormulario)

router.put('/', putFormulario)

module.exports = router