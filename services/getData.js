async function getAllDisponiveis(){
    const response = await fetch("http://localhost:4200/api/disponiveis");
    const produtos = await response.json();
    console.log(produtos);
    return produtos.prod_disp;
  }
async function getAllProducts() {
  const disponiveis = await getAllDisponiveis();

  const produtos = await Promise.all(
    disponiveis.map(d => getProduct(d.prod_id))
  );

  console.log("Produtos carregados:", produtos);
  return produtos;
}

/*retorna:
descricao: "",
id:"",
img_url :"",
nome:"",
tipo:""
*/
async function getProduct(id){
    const response = await fetch(`http://localhost:4200/api/produto/${id}`);
    const produto = await response.json();
    return produto;
  }
async function getAllCombos(){
    const response = await fetch("http://localhost:4200/api/combos");
    const combos = await response.json();
    console.log(combos);
    return combos;
  }
