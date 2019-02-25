let gameID;
let state = Array(9).fill("");
turn = 0;

function player() {
  return turn % 2 > 0 ? "O" : "X";
}

function indexFromSquare(square) {
  return Number(square.dataset.y) * 3 + Number(square.dataset.x);
}

function updateState(square) {
  let p = player(); // tests want player() called only onoce, so I can't call it from both places below.
  // state[indexFromSquare(square)] = p;
  square.innerHTML = p;
}

function setMessage(str) {
  $("#message").append(str);
}

function currentState() {
  let state = []
  for (td of $('td')) {
    state.push(td.innerHTML)
  }
  return state
}

function won() {
  let winner;
  const winCombos = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left row
    [1, 4, 7], // vertical middle row
    [2, 5, 8], // right row
    [0, 4, 8], // top left diag
    [2, 4, 6] // top right diag
  ];
  winCombos.forEach(combo => {
    const state = currentState()
    if (
      state[combo[0]] === state[combo[1]] &&
      state[combo[0]] === state[combo[2]] &&
      state[combo[0]] !== ""
    ) {
      winner = state[combo[0]]
    }
  });
  return winner;
}

function checkWinner() {
  if (winner = won()) {
    console.log(`Player ${winner} Won!`);
    setMessage(`Player ${winner} Won!`);
    return true;
  } else {
    return false
  }
}

function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    turn = 0
  } else {
    turn++;
  }
}
function attachListeners() {
  // Attaches the appropriate event listeners to the squares of the game board as well as for the`button#save`, `button#previous`, and`button#clear` elements.
  // When a user clicks on a square on the game board, the event listener should invoke`doTurn()` and pass it the element that was clicked.
  $("td").on("click", function() {
    doTurn(this);
  });
  // *** NOTE ***: `attachListeners()` _must_ be invoked inside either a`$(document).ready()`(jQuery) or a`window.onload = () => {}`(vanilla JavaScript).Otherwise, a number of the tests will fail(not to mention that your game probably won't function in the browser).
  // When you name your save and previous functions, make sure to call them something like`saveGame()` and`previousGames()`.If you call them`save()` and`previous()` you may run into problems with the test suite.
}

// ON LOAD
$(function() {
  mocha.run()
  attachListeners();
});

function getOrCreateGameId() {
  $.get("/games/", data => {
    let games = data.data;
    if (games.length === 0) {
      $.post("/games/", data => {
        gameId = Number(data.data.id);
      });
    } else {
      gameId = Number(games[games.length - 1].id);
    }
  });
}
