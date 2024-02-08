const fs = require("fs");
const OracleDb = require('../oracle.js');
const oracleDbInstance = new OracleDb();

function getTodosFormularios() {
    console.log('ta tentando pegar o json do form');
    return JSON.parse(fs.readFileSync("formularios.json"));
}
async function getFormularioPorCpf(cpf) {
    const conn = await oracleDbInstance.connect();

    const query = "SELECT * FROM FORMULARIO WHERE CPF = :cpf";
    try {
        console.log('cpf', cpf);
        const response = await conn.execute(query, [cpf]);
        if (response.rows.length === 0) {
            // CPF não encontrado, retornar null
            return null;
        }
        return response.rows[0];
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function verificarCpfExistente(cpf) {
    const conn = await oracleDbInstance.connect();
    const query = 'SELECT CPF FROM FORMULARIO WHERE CPF = :Cpf';
    try {
      const result = await conn.execute(query, { Cpf: cpf });
      return result.rows.length > 0; 
    } catch (err) {
      return false;
    }
  }

async function novoCadastroFormulario(campos) {
    const cpfExistente = await verificarCpfExistente(campos.Cpf);
    if (cpfExistente) {
      return false;
    }  
    const conn = await oracleDbInstance.connect(); 
    const query = 'INSERT INTO FORMULARIO (CPF, NOME, GENERO, EMAIL_CADASTRO, DATA_NASCIMENTO, NOME_MAE, TELEFONE_CADASTRO, PIS, NACIONALIDADE, PROFISSAO, ESTADOCIVIL, ESCOLARIDADE, NUMDEPENDENTES, CEP, ESTADO, RUA, NUMERO, COMPLEMENTO, BAIRRO, CIDADE) VALUES (:Cpf, :Nome, :Genero, :EmailCadastro, TO_DATE(:DataNascimento, \'YYYY-MM-DD\'), :NomeMae, :TelefoneCadastro, :Pis, :Nacionalidade, :Profissao, :Estadocivil, :Escolaridade, :NumDependentes, :Cep, :Estado, :Rua, :Numero, :Complemento, :Bairro, :Cidade)';
    try {
        await conn.execute(query, campos);
        return true;
    } catch (err) {
        return err;
    }
}

async function atualizaFormulario(atualizacoes) {
    console.log('oioi')
    const conn = await oracleDbInstance.connect();
    const query = `
        UPDATE FORMULARIO
        SET
            NOME = :Nome,
            CPF = :Cpf,
            GENERO = :Genero,
            EMAIL_CADASTRO = :EmailCadastro,
            DATA_NASCIMENTO = TO_DATE(:DataNascimento, 'YYYY-MM-DD'),
            NOME_MAE = :NomeMae,
            TELEFONE_CADASTRO = :TelefoneCadastro,
            PIS = :Pis,
            NACIONALIDADE = :Nacionalidade,
            PROFISSAO = :Cargo,
            ESTADOCIVIL = :Estadocivil,
            ESCOLARIDADE = :Escolaridade,
            NUMDEPENDENTES = :NumDependentes,
            CEP = :Cep,
            ESTADO = :Estado,
            RUA = :Rua,
            NUMERO = :Numero,
            COMPLEMENTO = :Complemento,
            BAIRRO = :Bairro,
            CIDADE = :Cidade
        WHERE CPF = :Cpf
    `;
    try {
        const rows = await conn.execute(query, atualizacoes);
        return rows;
    } catch (err) {
        console.error(err);
        return err;
    }
}

// function insereFormulario(formularioNovo) {
//     const formularios = JSON.parse(fs.readFileSync("formularios.json"));
//     const novaListaDeFormularios = [...formularios, formularioNovo];
//     console.log(novaListaDeFormularios);
//     fs.writeFileSync("formularios.json", JSON.stringify(novaListaDeFormularios));
// }

// function modificaFormulario(modificacoes, cpf) {
//     let formulariosAtuais = JSON.parse(fs.readFileSync("formularios.json"));
//     const indiceModificado = formulariosAtuais.findIndex(formulario => formulario.cpf === cpf);
//     const conteudoMudado = { ...formulariosAtuais[indiceModificado], ...modificacoes };
//     formulariosAtuais[indiceModificado] = conteudoMudado;
//     fs.writeFileSync("formularios.json", JSON.stringify(formulariosAtuais));
// }

async function deletaFormularioPorCpf(cpf) {
    const conn = await oracleDbInstance.connect();
    const deleteQuery = "DELETE FROM FORMULARIO WHERE CPF = :cpf";
    try {
        const result = await conn.execute(deleteQuery, [cpf]);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }

    // Now, update the local JSON file to reflect the changes (optional, depending on your use case)
    // const formularios = JSON.parse(fs.readFileSync("formularios.json"));
    // const formulariosFiltrados = formularios.filter(formulario => formulario.cpf !== cpf);
    // fs.writeFileSync("formularios.json", JSON.stringify(formulariosFiltrados));
}

module.exports = {
    getTodosFormularios,
    getFormularioPorCpf,
    // insereFormulario,
    // modificaFormulario,
    deletaFormularioPorCpf,
    novoCadastroFormulario,
    atualizaFormulario,
    verificarCpfExistente
}
