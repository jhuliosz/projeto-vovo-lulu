export async function getAllDisponiveis(){
    const response = await fetch("http://localhost:4200/api/disponiveis");
    const produtos = await response.json();
    console.log(produtos);
    return produtos.prod_disp;
  }
export async function getAllProducts() {
  const disponiveis = await getAllDisponiveis();

  const produtos = await Promise.all(
    disponiveis.map(d => (d.tipo!="combos")?getProduct(d.prod_id):getCombos(d.prod_id))
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
export async function getProduct(id){
    const response = await fetch(`http://localhost:4200/api/produto/${id}`);
    const produto = await response.json();
      return produto;
  }
export async function getCombos(id){
    const response = await fetch(`http://localhost:4200/api/combos/${id}`);
    const combos = await response.json();
    console.log(combos);
    return combos;
  }
