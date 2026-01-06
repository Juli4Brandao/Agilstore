const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function salvarProdutos() {
  fs.writeFileSync(
    "produtos.json",
    JSON.stringify(produtos, null, 2)
  );
}
function carregarProdutos() {
  if (fs.existsSync("produtos.json")) {
    const dados = fs.readFileSync("produtos.json", "utf-8");
    produtos = JSON.parse(dados);

    if (produtos.length > 0) {
      proximoId = produtos[produtos.length - 1].id + 1;
    }
  }
}

let produtos = [];
let proximoId = 1;

function mostrarMenu() {
  console.log("\n=== AgilStore ===");
  console.log("1 - Adicionar produto");
  console.log("2 - Listar produtos");
  console.log("3 - Atualizar produto");
  console.log("4 - Excluir produto");
  console.log("5 - Buscar produto");
  console.log("0 - Sair");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
      case "1":
        adicionarProduto();
        break;
      case "2":
        listarProdutos();
        break;
      case "3":
        atualizarProduto();
        break;
      case "4":
        excluirProduto();
        break;
      case "5":
        buscarProduto();
        break;
      case "0":
        console.log("Encerrando aplicação...");
        rl.close();
        break;
      default:
        console.log("Opção inválida!");
        mostrarMenu();
    }
  });
}

function adicionarProduto() {
  rl.question("Nome do produto: ", (nome) => {
    rl.question("Categoria: ", (categoria) => {
      rl.question("Quantidade em estoque: ", (quantidade) => {
        rl.question("Preço: ", (preco) => {

          const produto = {
            id: proximoId++,
            nome,
            categoria,
            quantidade: Number(quantidade),
            preco: Number(preco)
          };

          produtos.push(produto);
          console.log("Produto adicionado com sucesso!");
          salvarProdutos();
          mostrarMenu();
        });
      });
    });
  });
}

function listarProdutos() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado.");
  } else {
    produtos.forEach((produto) => {
      console.log(
        `ID: ${produto.id} | Nome: ${produto.nome} | Categoria: ${produto.categoria} | Qtd: ${produto.quantidade} | Preço: R$ ${produto.preco}`
      );
    });
  }
  mostrarMenu();
}

function atualizarProduto() {
  rl.question("Digite o ID do produto: ", (id) => {
    const produto = produtos.find(p => p.id === Number(id));

    if (!produto) {
      console.log("Produto não encontrado.");
      return mostrarMenu();
    }

    rl.question("Novo nome (enter para manter): ", (nome) => {
      if (nome) produto.nome = nome;

      rl.question("Nova categoria (enter para manter): ", (categoria) => {
        if (categoria) produto.categoria = categoria;

        rl.question("Nova quantidade (enter para manter): ", (quantidade) => {
          if (quantidade) produto.quantidade = Number(quantidade);

          rl.question("Novo preço (enter para manter): ", (preco) => {
            if (preco) produto.preco = Number(preco);

            salvarProdutos();
            console.log("Produto atualizado!");
            mostrarMenu();
          });
        });
      });
    });
  });
}
function excluirProduto() {
  rl.question("Digite o ID do produto: ", (id) => {
    const index = produtos.findIndex(p => p.id === Number(id));

    if (index === -1) {
      console.log("Produto não encontrado.");
      return mostrarMenu();
    }

    rl.question("Tem certeza que deseja excluir? (s/n): ", (resposta) => {
      if (resposta.toLowerCase() === "s") {
        produtos.splice(index, 1);
        salvarProdutos();
        console.log("Produto removido!");
      }
      mostrarMenu();
    });
  });
}
function buscarProduto() {
  rl.question("Buscar por ID ou nome: ", (termo) => {
    const resultado = produtos.filter(
      p =>
        p.id === Number(termo) ||
        p.nome.toLowerCase().includes(termo.toLowerCase())
    );

    if (resultado.length === 0) {
      console.log("Nenhum produto encontrado.");
    } else {
      resultado.forEach(p => {
        console.log(
          `ID: ${p.id} | Nome: ${p.nome} | Categoria: ${p.categoria} | Qtd: ${p.quantidade} | Preço: R$ ${p.preco}`
        );
      });
    }
    mostrarMenu();
  });
}
carregarProdutos();
mostrarMenu();