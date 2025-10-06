const repo = require('./CategoriasRepositorio.js')

repo.obterCategorias().then((categorias) => {
    console.log("==========================");
    for (let a of categorias)
        console.log(JSON.stringify(a));
    console.log("==========================");
})