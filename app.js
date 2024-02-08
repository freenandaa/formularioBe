const express = require("express")
const rotaFormulario = require("./rotas/formulario")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())
app.use('/formularios', rotaFormulario)

const port = 8000

app.listen(port, () => {
    console.log(`Escutando porta ${port}`)
})