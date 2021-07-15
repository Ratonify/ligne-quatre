/* **************
*  PUISSANCE 4  *
*   14/7/2021   *
*  by Ratonify  *
************** */
let gameGrid = document.getElementById('connect-4');
let playerOneScore = document.getElementById('player-one-score');
let playerTwoScore = document.getElementById('player-two-score');
let playersTurn = document.getElementById('players-turn');
let gameInfo = document.getElementById('game-info');

let columnNumber = 7;
let rowNumber = 6;
let connect4 = [];
let victoriousSong = false;
let currentPlayTurn = 0;
let limitPlayTurn = columnNumber*rowNumber;
let players = [
	{ 
		name: "One",
		bgColor: "playerOne",
		symbol: 1
	},
	{ 
		name: "Two",
		bgColor: "playerTwo",
		symbol: 2
	}
];
let currentPlayer = 0;


connect4 = generateGrid(columnNumber, rowNumber);
console.log(connect4);


function checkWinner() {
	if(checkVertically() || checkHorizontally() || checkDiagonally()) {
		victoriousSong = true;
		gameInfo.textContent = `Le gagnant est : ${players[currentPlayer].name}`;
		gameGrid.classList.add('disabled');
	}
	return false;
}


/* Montrer la combinaison victorieuse */
function showWinner(cell1, cell2, cell3, cell4) {
	for (let i = 0; i < 4; i++) {
		document.querySelector(`[data-cell='${arguments[i]}']`).classList.add('showWinner');
	}
}


/* Vérifier la combinaison de victoire verticalement */
function checkVertically() {
	for(let i = columnNumber-1; i >= 0; i--){
		for (let j = 0; j < rowNumber-3; j++){
			if(connect4[i][j] === players[currentPlayer].symbol &&
				connect4[i][j+1] === players[currentPlayer].symbol &&
				connect4[i][j+2] === players[currentPlayer].symbol &&
				connect4[i][j+3] === players[currentPlayer].symbol) 
				{
					showWinner(`${i}-${j}`, `${i}-${j+1}`, `${i}-${j+2}`, `${i}-${j+3}`);
					console.log(`Combinaison gagnante : ${i}-${j} -- ${i}-${j+1} -- ${i}-${j+2} -- ${i}-${j+3}`);
					return true;
			}
		}
	}
}

/* Vérifier la combinaison de victoire horizontalement */
function checkHorizontally() {
	for(let i = 0; i < rowNumber; i++){
		for (let j = columnNumber-4; j >= 0; j--){
			if(connect4[j][i] === players[currentPlayer].symbol &&
				connect4[j+1][i] === players[currentPlayer].symbol &&
				connect4[j+2][i] === players[currentPlayer].symbol &&
				connect4[j+3][i] === players[currentPlayer].symbol) 
				{
					showWinner(`${j}-${i}`, `${j+1}-${i}`, `${j+2}-${i}`, `${j+3}-${i}`);
					console.log(`Combinaison gagnante : ${j}-${i} -- ${j+1}-${i} -- ${j+2}-${i} -- ${j+3}-${i}`);
					return true;
			}
		}
	}
}

/* Vérifier la combinaison de victoire diagonalement */
function checkDiagonally() {
	for(let i = rowNumber-3; i >= 0; i--){
		for (let j = 0; j < columnNumber-4; j++){
			if(connect4[i][j] === players[currentPlayer].symbol &&
				connect4[i+1][j+1] === players[currentPlayer].symbol &&
				connect4[i+2][j+2] === players[currentPlayer].symbol &&
				connect4[i+3][j+3] === players[currentPlayer].symbol) 
				{
					showWinner(`${i}-${j}`, `${i+1}-${j+1}`, `${i+2}-${j+2}`, `${i+3}-${j+3}`);
					console.log(`Combinaison gagnante : ${i}-${j} -- ${i+1}-${j+1} -- ${i+2}-${j+2} -- ${i+3}-${j+3}`);
					return true;
			}
		}
	}
	for(let i = rowNumber-3; i >= 0; i--){
		for (let j = columnNumber-2; j > 2; j--){
			if(connect4[i][j] === players[currentPlayer].symbol &&
				connect4[i+1][j-1] === players[currentPlayer].symbol &&
				connect4[i+2][j-2] === players[currentPlayer].symbol &&
				connect4[i+3][j-3] === players[currentPlayer].symbol) 
				{
					showWinner(`${i}-${j}`, `${i+1}-${j-1}`, `${i+2}-${j-2}`, `${i+3}-${j-3}`);
					console.log(`Combinaison gagnante : ${i}-${j} -- ${i+1}-${j-1} -- ${i+2}-${j-2} -- ${i+3}-${j-3}`);
					return true;
			}
		}
	}
}


/* Changement de joueur */
function playerTurn() {
	/* On passe la main à l'autre joueur */
	if(!victoriousSong) {
		currentPlayer = currentPlayer == 1 ? 0 : 1;
		playersTurn.textContent = players[currentPlayer].name;
		gameInfo.textContent = "";
	}

	/* Compter le nombre de tours de jeu */
	/* Si le plateau de jeu est à ras bord */
	if (currentPlayTurn == limitPlayTurn-1) {
		gameInfo.textContent = "Partie terminée.";
		gameGrid.classList.add('disabled');
	}
	/* Sinon la partie continue */
	else if (currentPlayTurn < limitPlayTurn) {
		currentPlayTurn++;
	}
}


/* Coloriser la dernière cellule d'une colonne */
function colorColumnCell(inColumn) {
	/* Récupération des nodes de la colonne */
	let lastChild = inColumn.childNodes;

	/* Boucle pour coloriser la première cellule en partant de la fin */
	for (let i = rowNumber-1; i >= 0; i--) {
		/* Vérifier s'il y a une place restante dans la colonne */
		if (!lastChild[i].classList.contains('cell-colored')) {

			/* Indiquer le symbole dans le tableau grâce au dataset de la cellule */
			let cellCoordonnates = lastChild[i].dataset.cell.split("-");
			connect4[cellCoordonnates[0]][cellCoordonnates[1]] = players[currentPlayer].symbol;

			/* Vérifier les conditions de victoire */
			checkWinner();

			/* Colorisation de la cellule et on change de joueur */
			lastChild[i].classList.add('cell-colored', `${players[currentPlayer].bgColor}`);

			playerTurn();

			break;
		} 
		/* Sinon la colonne est pleine, rien de ne passe */
		else if (lastChild[0].classList.contains('cell-colored')) {
			gameInfo.textContent = "Choisissez une autre colonne.";

			break;
		}
	}
}


/* Générer la grille de jeu */
function generateGrid(axeX, axeY) {
	/* D'abord les colonnes (en flex) */
	let connectTable = [];

	for (let x = 0; x < axeX; x++) {
		let column = document.createElement("DIV");
		column.classList.add('column-style');
		gameGrid.appendChild(column);

		let connectCell = [];

		column.addEventListener('click', () => {
			colorColumnCell(column);
		});

		/* Ensuite les lignes */
		for (let y = 0; y < axeY; y++) {
			let row = document.createElement("DIV");
			row.classList.add('cell-empty');
			row.dataset.cell = `${x}-${y}`;
			row.textContent = `${x}-${y}`;
			column.appendChild(row);

			connectCell.push(`${x}-${y}`);
		}
		connectTable.push(connectCell);
	}

	playersTurn.textContent = players[currentPlayer].name;

	return connectTable;
}