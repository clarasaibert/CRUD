//variavel para cadastrar
const openModal = () =>  document.getElementById("modal").classList.add("is-active")

const closeModal = () => {
  clearFields()
  document.getElementById("modal").classList.remove("is-active")
}

//armazenar os dados inseridos
const getLocalStorage = () => JSON.parse(localStorage.getItem("db_games")) ?? []
const setLocalStorage = (dbGame) => localStorage.setItem("db_games", JSON.stringify(dbGame))


//create
const createGame = (game) => {
  const dbGame = getLocalStorage()
  dbGame.push(game)
  setLocalStorage(dbGame)
}

//read
const readGame = () => getLocalStorage()

//update
const updateGame = (index, game) => {
  const dbGame = readGame()
  dbGame[index] = game
  setLocalStorage(dbGame)
}

//delete
const deleteGame = (index) => {
  const dbGame = readGame()
  dbGame.splice(index, 1)
  setLocalStorage(dbGame)
}


const isValidFields = () => {
  return document.getElementById("form").reportValidity()
}

//interação com layout
const clearFields = () => {
  const fields = document.querySelectorAll (".modal-field")
  fields.forEach((field) => (field.value = ""))
  document.getElementById("name").dataset.index = "new"
}

const saveGame = () =>{
  if (isValidFields()){
    const game = {
      nome: document.getElementById("name").value,
      statusDoJogo: document.getElementById("gameTime").value,
      genero: document.getElementById("gender").value,
    }
    const index = document.getElementById("name").dataset.index
    if (index == "new") {
      createGame(game)
      createRow(game)
      updateTable()
      closeModal() 
    } else {
      updateGame(index, game)
      updateTable()
      closeModal()
    }
   
  }
}

//criando nova linha para a tabela
const createRow = (game, index) => {
  const newRow = document.createElement("tr")
  newRow.innerHTML = `
  <td>${game.nome}</td>
  <td>${game.statusDoJogo}</td>
  <td>${game.genero}</td>
  <td>
  <button class="button is-small is-success is-outlined" style="margin-right: 7px" id="edit-${index}">Editar</button>
  <button class="button is-small is-success is-outlined" style="margin-left: 7px" id="delete-${index}">Excluir</button>
  </td>
  `
  document.querySelector("#tableGame>tbody").appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll("#tableGame>tbody tr")
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbGame = readGame()
  clearTable()
  dbGame.forEach(createRow)
}

const fillFields = (game) => {
  document.getElementById("name").value = game.nome
  document.getElementById("gameTime").value = game.statusDoJogo
  document.getElementById("gender").value = game.genero
  document.getElementById("name").dataset.index = game.index
}

//ação dos botoes de editar e deletar
const editGame = (index) => {
  const game = readGame()[index]
  game.index = index
  fillFields(game)
  openModal()
}

const editDelete = (event) => {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    const [action, index] = target.id.split("-");
    const game = readGame()[index];

    if (action === "edit") {
      editGame(index);
    } else if (action === "delete") {
      const response = confirm(`Deseja excluir o jogo ${game.nome}?`);
      if (response) {
        deleteGame(index);
        updateTable();
      }
    }
  }
}

//eventos
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openModalButton").addEventListener("click", openModal)
  document.getElementById("closeModalButton").addEventListener("click", closeModal)
  document.getElementById("saveItemButton").addEventListener("click", saveGame)
  document.getElementById("cancelItemButton").addEventListener("click", closeModal)
  updateTable()
  document.querySelector("#tableGame>tbody").addEventListener("click", editDelete)
})