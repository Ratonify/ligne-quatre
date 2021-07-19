/* **************
*  PUISSANCE 4  *
*   14/7/2021   *
*  by Ratonify  *
************** */
/* GAME */
const gameGrid = document.getElementById('connect-4');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoScore = document.getElementById('player-two-score');
const playersTurn = document.getElementById('players-turn-token');
const restartGameButton = document.getElementById('restart');
/* VARIABLES */
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
/* HOME */
const cpuActivated = document.getElementById("J2-cpu")
const generate = document.getElementById('generate');
const inputJ1 = document.getElementById('J1-nom');
const inputJ2 = document.getElementById('J2-nom');


generate.addEventListener('click', () => {
	/* Générer le jeu */
	launchConnect4();
});


/**
 * Vérifier qu'il y a bien des noms pour les joueurs
 */
function checkValues() {
	if(cpuActivated.value == "1") {
		/* Si CPU, désactiver uniquement si nom du joueur 1 est vide OU si nom = CPU */
		generate.disabled = (inputJ1.value === "") || (inputJ1.value == "CPU") ? true : false;
	} else {
		/* Désactiver le bouton "Générer" si axeX ET/OU axeY est vide OU si les noms sont identiques */
		generate.disabled = (inputJ1.value === "" && inputJ2.value === "") || (inputJ1.value === "" || inputJ2.value === "") || (inputJ1.value == inputJ2.value) ? true : false;
	}
}


/**
 * Afficher/masquer l'input du J2
 * @param {*} mode 1 joueur ou 2 joueurs
 */
function showNameJ2(mode) {
	let changeCPU = document.getElementById("CPU--J2");
	let showJ2 = document.getElementById("J2-nom");
	
	document.getElementById("fade-group").classList.remove('animation-fadein');
	document.getElementById("fade-group").offsetHeight;
	document.getElementById("fade-group").classList.add('animation-fadein');

	/* Gestion du CPU et du joueur 2 */
	if (mode === 1) {
		changeCPU.innerText = "Joueur 2";
		showJ2.style.display = "block";
		cpuActivated.value = "0";
	} else {
		changeCPU.innerText = "CPU";
		showJ2.style.display = "none";
		inputJ2.value = "";
		cpuActivated.value = "1";
	}
	checkValues();
}

/**
 * Démarer le jeu pour la première fois
 */
function launchConnect4() {
	/* Au lancement du jeu, masquer les paramètres */
	document.getElementById('settings').classList.add("hide");
	document.getElementById('connect4-game').classList.add("superb", "show");

	/* Récupérer les valeurs des couleurs */
	let colorX = $("#J1-couleur").spectrum("get");
	let colorY = $("#J2-couleur").spectrum("get");

	/* Insérer le nom des joueurs */
	players[0].name = inputJ1.value;
	players[1].name = inputJ2.value === "" ? players[1].name = "CPU" : inputJ2.value;

	/* Création et injection d'une balise style avec les couleurs */
	let styleBg = document.createElement('style');
	styleBg.innerText = `.playerOne { background-color: ${colorX}; border: 4px outset gray; } 
	.playerTwo { background-color: ${colorY}; border: 4px outset ${colorY}; } 
	.playerOneBg { background: linear-gradient(30deg, rgba(214,232,248,1) 50%, ${colorX} 100%); }
	.playerTwoBg { background: linear-gradient(330deg, rgba(214,232,248,1) 50%, ${colorY} 100%); }`;
	document.head.appendChild(styleBg);

	/* Afficher le panneau des scores et des infos */
	document.getElementById("player-one-name").textContent = `${players[0].name}`;
	document.getElementById("player-two-name").textContent = `${players[1].name}`;
	document.getElementById("player-one-name").classList.add('playerOneBg');
	document.getElementById("player-two-name").classList.add('playerTwoBg');

	connect4 = generateGrid(columnNumber, rowNumber);
}

/**
 * Vérification des combinaisons
 * @returns 
 */
function checkWinner() {
	if(checkVertically() || checkHorizontally() || checkDiagonally()) {
		victoriousSong = true;
		
		/* Désactiver le jeu */
		gameGrid.classList.add('disabled');

		/* Incrémenter le score du gagnant */
		players[currentPlayer].symbol == 1 ? playerOneScore.textContent++ : playerTwoScore.textContent++;

		/* Popup pour relancer une partie */
		restartGameButton.classList.add('show');

		restartGameButton.addEventListener('click', () => {
			restartGame();
		});
	}
	return false;
}


/**
 * Montrer la combinaison victorieuse
 * @param {String} cell1 Première cellule
 * @param {String} cell2 
 * @param {String} cell3 
 * @param {String} cell4 Dernière cellule
 */
function showWinner(cell1, cell2, cell3, cell4) {
	for (let i = 0; i < 4; i++) {
		document.querySelector(`[data-cell='${arguments[i]}']`).classList.add('showWinner');
	}
}


/**
 * Vérifier les combinaisons de victoire verticalement
 * @returns 
 */
function checkVertically() {
	for(let i = columnNumber-1; i >= 0; i--){
		for (let j = 0; j < rowNumber-3; j++){
			if(connect4[i][j] === players[currentPlayer].symbol &&
				connect4[i][j+1] === players[currentPlayer].symbol &&
				connect4[i][j+2] === players[currentPlayer].symbol &&
				connect4[i][j+3] === players[currentPlayer].symbol) 
				{
					showWinner(`${i}-${j}`, `${i}-${j+1}`, `${i}-${j+2}`, `${i}-${j+3}`);
					return true;
			}
		}
	}
}

/**
 * Vérifier les combinaisons de victoire horizontalement
 * @returns 
 */
function checkHorizontally() {
	for(let i = 0; i < rowNumber; i++){
		for (let j = columnNumber-4; j >= 0; j--){
			if(connect4[j][i] === players[currentPlayer].symbol &&
				connect4[j+1][i] === players[currentPlayer].symbol &&
				connect4[j+2][i] === players[currentPlayer].symbol &&
				connect4[j+3][i] === players[currentPlayer].symbol) 
				{
					showWinner(`${j}-${i}`, `${j+1}-${i}`, `${j+2}-${i}`, `${j+3}-${i}`);
					return true;
			}
		}
	}
}

/**
 * Vérifier les combinaisons de victoire diagonalement
 * @returns 
 */
function checkDiagonally() {
	for(let i = rowNumber-3; i >= 0; i--){
		for (let j = 0; j < columnNumber-4; j++){
			if(connect4[i][j] === players[currentPlayer].symbol &&
				connect4[i+1][j+1] === players[currentPlayer].symbol &&
				connect4[i+2][j+2] === players[currentPlayer].symbol &&
				connect4[i+3][j+3] === players[currentPlayer].symbol) 
				{
					showWinner(`${i}-${j}`, `${i+1}-${j+1}`, `${i+2}-${j+2}`, `${i+3}-${j+3}`);
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
					return true;
			}
		}
	}
}

/**
 * Nouvelle partie
 */
function restartGame() {
	/* Effacer le jeu */
	while (gameGrid.firstChild) {
		gameGrid.firstChild.remove();
	}

	/* Ré-initialisation des variables pour une nouvelle partie */
	gameGrid.classList.remove('disabled');
	restartGameButton.classList.remove('show');
	connect4 = [];
	connect4 = generateGrid(columnNumber, rowNumber)
	victoriousSong = false;
	currentPlayTurn = 0;
}


/**
 * Changement de joueur
 */
function playerTurn() {
	/* On passe la main à l'autre joueur */
	if(!victoriousSong || victoriousSong && cpuActivated.value == "1") {
		currentPlayer = currentPlayer == 1 ? 0 : 1;

		if(currentPlayer == 1) {
			playersTurn.classList.remove(`${players[0].bgColor}`);
			playersTurn.classList.add(`${players[1].bgColor}`);
		} else {
			playersTurn.classList.remove(`${players[1].bgColor}`);
			playersTurn.classList.add(`${players[0].bgColor}`);
		}
	}

	/* Gestion de l'IA -- Si c'est au tour du CPU de jouer */
	if (!victoriousSong && currentPlayer === 1 && cpuActivated.value == "1") {

		/* Récupérer toutes les colonnes */
		let randomDiv = document.getElementsByClassName('column-style');

		/* Boucle pour trouver une colonne vide */
		while (true) {
			/* Sélection d'une colonne au hasard */
			let randomizer = randomDiv[Math.floor(Math.random() * randomDiv.length)];
			let lastChild = randomizer.childNodes;

			/* On boucle jusqu'à trouver une colonne vide */
			if(!lastChild[0].classList.contains('cell-colored')) {
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
					lastChild[i].classList.add('cell-colored', `${players[currentPlayer].bgColor}`, 'token-placed');

					playerTurn();

					break;
					} 
				}
				break;
			}
		}
	}

	/* Compter le nombre de tours de jeu */
	/* Si le plateau de jeu est à ras bord */
	if (currentPlayTurn == limitPlayTurn-1) {
		gameGrid.classList.add('disabled');

		/* Popup pour relancer une partie */
		restartGameButton.classList.add('show');

		restartGameButton.addEventListener('click', () => {
			restartGame();
		});
	}
	/* Sinon la partie continue */
	else if (currentPlayTurn < limitPlayTurn) {
		currentPlayTurn++;
	}
}


/**
 * Coloriser la dernière cellule d'une colonne
 * @param {*} inColumn Colonne contenant les div
 */
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
			lastChild[i].classList.add('cell-colored', `${players[currentPlayer].bgColor}`, 'token-placed');

			playerTurn();

			break;
		} 
		/* Sinon la colonne est pleine, rien de ne passe */
		else if (lastChild[0].classList.contains('cell-colored')) {
			break;
		}
	}
}


/**
 * Générer la grille de jeu
 * @param {Number} axeX Nombre de colonne
 * @param {Number} axeY Nombre de ligne
 * @returns Tableau des résultats
 */
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
			column.appendChild(row);

			connectCell.push(`${x}-${y}`);
		}
		connectTable.push(connectCell);
	}

	playersTurn.classList.add(`${players[currentPlayer].bgColor}`);

	return connectTable;
}