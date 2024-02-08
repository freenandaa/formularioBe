const { getTodosFormularios, getFormularioPorCpf, insereFormulario, atualizaFormulario, modificaFormulario, deletaFormularioPorCpf, novoCadastroFormulario} = require("../servicos/formulario")

function getFormularios(req,res) {
    console.log("O get funcionou")
        try {
            //const cpf = getFormularioPorCpf(cpf)
            const formularios = getTodosFormularios()
            res.send(formularios)
        } catch (error) {
            res.status(500)
            res.send(error.message)
        }
}

function getFormulario(req,res) {
    try {
        const cpf = req.params.cpf
        getFormularioPorCpf(cpf).then((formulario) => {
            if (formulario === null) {
                // CPF não encontrado no banco de dados
                res.status(404).send("CPF não encontrado no banco de dados");
            } else {
                res.send(formulario);
            }
        })

    } catch (error) {
        res.status(500)
        res.send(error.message)
    }
}
function postFormulario(req,res) {
    try {
        const formularioNovo = req.body
        if (req.body.Nome){
            insereFormulario(formularioNovo)
            res.status(201)
            res.send("Formulario inserido")
        } else {
            res.status(422)
            res.send("O campo nome completo é obrigatório")
       }

    } catch (error) {
        res.status(500)
        res.send(error.message)
    }
}

async function postCadastroFormulario(req,res) {
    try {
        const resultado = await novoCadastroFormulario(req.body);
        if (!resultado) {
            res.status(404).send("CPF já existente no banco de dados");
        } else {
            res.status(201).send('Cadastro realizado com sucesso!');
        }
        
    } catch (error) {
        res.status(500)
        res.send(error.message)
    }
}

function patchFormulario(req,res) {
    try {
        const cpf = req.params.cpf
        if (cpf && Number(cpf)) {
            const body = req.body
            modificaFormulario(body, cpf)
            res.send("Item modificado")
        } else {
            res.status(422)
            res.send("Cpf inválido")
        }
    } catch(error) {(error) 
        res.status(500)
        res.send(error.message)

    }
}

function deleteFormulario(req,res) {
    try{
        const cpf = req.params.cpf
        deletaFormularioPorCpf(cpf)
        res.send("Formulario deletado")
    } catch (error) {
        res.status(500)
        res.send(error.message)
    }
}

function putFormulario(req,res) {
    try {
        const body = req.body
        atualizaFormulario(body)
        res.send("Item atualizado")
    } catch(error) {(error) 
        res.status(500)
        res.send(error.message)
    }
}


module.exports = {
    getFormularios,
    getFormulario,
    postFormulario,
    patchFormulario,
    deleteFormulario,
    postCadastroFormulario,
    putFormulario
}