let gameID
turn = 0 


function player() {
  return (turn % 2 > 0) ? "O" : "X"
}

function indexFromSquare(square) {
  let index = Number(square.dataset.x) * 3 + Number(square.dataset.y)
}

function updateState(square) {
  square.innerHTML = player()
}

function setMessage(str) {
  // Accepts a string and adds it to the`div#message` element in the DOM.
  $('#message').append(str)
}
function checkWinner() {
  // Returns`true` if the current board contains any winning combinations(three`X` or`O` tokens in a row, vertically, horizontally, or diagonally).Otherwise, returns`false`.
  // If there is a winning combination on the board, `checkWinner()` should invoke`setMessage()`, passing in the appropriate string based on who won: `'Player X Won!'` or`'Player O Won!'`
}
function doTurn(square) {
  // Invokes the`updateState()` function, passing it the element that was clicked.
  updateState(square)
  // Increments the`turn` variable by`1`.
  turn++
  checkWinner()
  // Invokes`checkWinner()` to determine whether the move results in a winning play.
}
function attachListeners() {
  // Attaches the appropriate event listeners to the squares of the game board as well as for the`button#save`, `button#previous`, and`button#clear` elements.
  // When a user clicks on a square on the game board, the event listener should invoke`doTurn()` and pass it the element that was clicked.
  attachSquareListeners()
  // *** NOTE ***: `attachListeners()` _must_ be invoked inside either a`$(document).ready()`(jQuery) or a`window.onload = () => {}`(vanilla JavaScript).Otherwise, a number of the tests will fail(not to mention that your game probably won't function in the browser).
  // When you name your save and previous functions, make sure to call them something like`saveGame()` and`previousGames()`.If you call them`save()` and`previous()` you may run into problems with the test suite.
}

// ON LOAD
$(function () {
  mocha.run()
  attachListeners()
})

function attachSquareListeners() {
  $('td').on('click', function(){
    doTurn(this)
  })
}

function getOrCreateGameId() {
  $.get('/games/', (data) => {
    let games = data.data
    if (games.length === 0) {
      $.post('/games/', (data) => {
        gameId = Number(data.data.id)
      })
    } else {
      gameId = Number(games[games.length-1].id)
    }
  })
}