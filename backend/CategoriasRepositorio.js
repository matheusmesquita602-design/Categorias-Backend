const { Categorias } = require('../models');

//CRUD
//Create
const salvarCategorias = async (nome, premio,data) => {
    const categorias = await Categorias.create({
        nome: nome, premio:premio, data:data
    });
    return categorias
}

//Read
const obterCategorias = async() => {
    return await Categorias.findAll({
        attributes:['id','nome','premio','data', 'createdAt', 'updatedAt']
    })
}

//Read por Id
const obterCategoriasPorId = async(id) => {
    return await Categorias.findByPk(id, {
        attributes:['id','nome','premio','data', 'createdAt', 'updatedAt']
    });
}

//Update
const atualizarCategorias = async (id, nome, premio, data) => {
  const categorias = await Categorias.findByPk(id);

  if (!categorias) {
    return null; 
  }

  categorias.nome = nome;
  categorias.premio = premio;
  categorias.data = data;

  await categorias.save();
  return categorias;
};

//Delete
const excluirCategorias = async(id) => {
    const categorias = await Categorias.findByPk(id);
    if (categorias){
        await categorias.destroy();
    }
}

module.exports = {
    obterCategorias: obterCategorias,
    obterCategoriasPorId: obterCategoriasPorId,
    salvarCategorias: salvarCategorias,
    excluirCategorias: excluirCategorias,
    atualizarCategorias: atualizarCategorias,
}