const repo = require('./CategoriasRepositorio.js')
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
const API = 'http://localhost:';
const port = 3000;
const categorias = '/Categorias'

//CRUD

//Create
app.post(`${categorias}`, async (req, res) => {
    const nome = req.body.nome;
    const premio = req.body.premio;
    const data = req.body.data;
    const categorias = await repo.salvarCategorias(nome,premio,data);
    res.json(categorias);
    res.end();
})

//Read
app.get('/Categorias', async (req, res) => {
    try {
        const categorias = await repo.obterCategorias();
        res.json(categorias);
        // Não é necessário res.end() após res.json()
    } catch (err) {
        // Loga o erro no console do backend para você ver
        console.error("Erro ao obter categorias:", err); 
        // Envia uma resposta JSON de erro para o frontend
        res.status(500).json({ 
            error: "Erro interno do servidor ao carregar categorias." 
        });
    }
});
//Read por Id
app.get('/Categorias/:id', async (req, res) => {
  const id = req.params.id;
  const categorias = await repo.obterCategoriasPorId(id);

  if(!categorias){
    return res.status(404).json({ error: 'Categoria não encontrada'});
  }
  
  res.json(categorias);
  res.end();
})


//Update
app.put('/Categorias/:id', async (req, res) => {
  try {
    const id = req.params.id; 
    const nome = req.body.nome;
    const premio = req.body.premio;
    const data = req.body.data;
    const categorias = await repo.atualizarCategorias(id, nome, premio, data);

    if (!categorias) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json(categorias);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

//Delete
app.delete('/Categorias/:id', async (req, res) => {
    const id = req.params.id; 
    const categorias = await repo.excluirCategorias(id)
    res.status(200).json('Categoria deletada');
    res.end()
})

app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
})