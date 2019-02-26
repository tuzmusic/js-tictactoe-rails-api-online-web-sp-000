turn = 0;
shouldDebug = false;

function player() {
  return turn % 2 > 0 ? "O" : "X";
}

function updateState(square) {
  square.innerHTML = player();
  turn++;
}

function setMessage(str) {
  $("#message").append(str);
}

function currentState() {
  let state = [];
  for (td of $("td")) {
    state.push(td.innerHTML);
  }
  return state;
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
    const state = currentState();
    if (
      state[combo[0]] === state[combo[1]] &&
      state[combo[0]] === state[combo[2]] &&
      state[combo[0]] !== ""
    ) {
      winner = state[combo[0]];
    }
  });
  return winner;
}

function tied() {
  for (td of $("td")) {
    if (td.innerHTML === "") return false;
  }
  setMessage("Tie game.");
  return true;
}

function checkWinner() {
  if ((winner = won())) {
    setMessage(`Player ${winner} Won!`);
    return true;
  } else {
    return false;
  }
}

function resetGame(save = true) {
  if (save) saveGame();
  turn = 0;
  $("td").text("");
  gameId = null;
}

function doTurn(square) {
  if (won() || square.innerHTML !== "") return;
  updateState(square);
  if (tied() || checkWinner()) resetGame();
}

function attachListeners() {
  $("td").on("click", function() {
    doTurn(this);
  });
  $("#clear").on("click", () => resetGame(false) );
  $("#save").on("click", () => saveGame());
  $("#previous").on("click", () => previousGames());
}

$(function() {
  mocha.run();
  attachListeners();
});

let gameId;

function saveGame() {
  let game = { state: currentState() };
  if (gameId) {
    let updating = $.ajax({
      url: `/games/${gameId}`,
      data: game,
      type: "PATCH"
    });
  } else {
    let posting = $.post("/games", game);
    posting.done(data => (gameId = data.data.id));
  }
}

function previousGames() {
  $.get("/games", data => {
    let games = data.data;
    let buttons = games.map(game => {
      return `<button onclick="loadGame(${game.id})" class="prevGameButton">${
        game.id
      }</button>`;
    });
    $("#games").html(buttons.join(" "));
  });
}

function loadGame(id) {
  $.get(`/games/${id}`, data => {
    let state = data.data.attributes["state"];
    turn = 0;
    for (td of $("td")) {
      let i = Number(td.dataset.y) * 3 + Number(td.dataset.x);
      td.innerHTML = state[i];
      if (state[i] !== "") turn++;
    }
    gameId = id;
  });
}
