const squareSize = Math.floor((document.documentElement.clientWidth > document.documentElement.clientHeight ? document.documentElement.clientWidth : document.documentElement.clientHeight) / 40);
const circleSize = Math.floor(document.documentElement.clientWidth / 80);
let playerSpeed = 0.2;
let change = 20;
let lifeTime = 20;
let squaresAmount = 1;
/*********************************************************/
let gamePoints = 0;
let round = 1;
/*********************************************************/
let breakFlag = false;
let game = false;
/*********************************************************/
let time = 60;
let breakTime = 3;
/*********************************************************/
let world;
let renderer;
/*********************************************************/
let canvas;
let ctx;
/*********************************************************/
let squares = [];
let player;
let bestPlayers = [];
/*********************************************************/
let requestID;
let intervalID;
/*********************************************************/
function initCanvas()
{
	console.log("Canvas initialize");
	canvas = document.getElementById("world");
	canvas.style.width='100%';
  	canvas.style.height='100%';
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	//ctx = canvas.getContext("2d");
}
/*********************************************************/
function Square(posX, posY, lifeTime, points)
{
	this.lifeTime = parseInt(lifeTime);
	this.change = change;
	this.state = 'z';
	this.posX = posX;
	this.posY = posY;
	this.points = points;
	this.break = false;
	
	this.create = function()
	{
		this.body = Physics.body('rectangle', { x: this.posX, y: this.posY, vx: 0.0, vy: 0.0, height: squareSize, width: squareSize,
											   styles: {fillStyle: "#10d140" }});
		
		let canv = document.createElement('canvas');
		canv.width = squareSize;
		canv.height = squareSize;
		let ct  = canv.getContext("2d");

		ct.fillStyle = this.body.styles.fillStyle;
		ct.fillRect(0, 0, squareSize, squareSize);

		ct.fillStyle = "#202b59";
		ct.beginPath();
		ct.moveTo(0,0);
		ct.lineTo(0,squareSize);
		ct.lineTo(squareSize,squareSize);
		ct.lineTo(squareSize,0);
		ct.lineTo(0,0);
		ct.stroke();

		ct.fillStyle = "#000000";
		ct.textAlign = "center"
		ct.textBaseline = "middle";
		ct.font = "15px sans-serif";
		ct.fillText(this.points, squareSize / 2, squareSize / 2);
		this.body.view = canv;
		world.add(this.body);
	}
	
	this.declifeTime = function()
	{
		if(this.lifeTime > 0)
		{
			this.lifeTime--;
			if(this.lifeTime == 0)
			{
				world.removeBody(this.body);
			}
		}
	}
	
	this.decChange = function() 
	{
		if(this.change > 0)
		{
			this.change--;
			if(this.change == 0)
			{
				this.changeState();
			}
		}
	}
	
	this.setChange = function(change)
	{
		this.change = change;
	}
	
	this.del = function()
	{
		world.removeBody(this.body);
	}
	
	this.changeState = function()
	{
		if(this.state == 'z') 
		{
			this.state = 'c';
			this.body.styles.fillStyle = "#8e1d4c";
			
			let canv = document.createElement('canvas');
			canv.width = squareSize;
			canv.height = squareSize;
			let ct  = canv.getContext("2d");
			
			ct.fillStyle = this.body.styles.fillStyle;
			ct.fillRect(0, 0, squareSize, squareSize);

			ct.fillStyle = "#202b59";
			ct.beginPath();
			ct.moveTo(0,0);
			ct.lineTo(0,squareSize);
			ct.lineTo(squareSize,squareSize);
			ct.lineTo(squareSize,0);
			ct.lineTo(0,0);
			ct.stroke();

			ct.fillStyle = "#000000";
			ct.textAlign = "center"
			ct.textBaseline = "middle";
			ct.font = "15px sans-serif";
			ct.fillText(this.points, squareSize / 2, squareSize / 2);
			this.body.view = canv;
		}
	}
}
/*********************************************************/
function Player(name, posX, posY)
{
	this.name = name;
	this.points = 0;
	this.posX = posX;
	this.posY = posY;
	this.direction = 0; //0-right,1-up,2-left,3-down
	
	this.create = function()
	{
		this.body = Physics.body('circle', {x: posX, y: posY, vx: 0.0, vy: 0.001, radius: circleSize,
											styles: { fillStyle: "#134693" , lineWidth: 1 }});
		world.add(this.body);
	}
	
	this.velocity = function(event)
	{
		switch(this.direction)
		{
			case 0:
				this.body.state.vel.set(playerSpeed, 0);
				break;
			case 1:
				this.body.state.vel.set(0, -playerSpeed);
				break;
			case 2:
				this.body.state.vel.set(-playerSpeed, 0);
				break;
			case 3:
				this.body.state.vel.set(0, playerSpeed);
				break;
		}
		
	}
}
/*********************************************************/
function comparePlayer(a, b)
{
	if(a.points < b.points) return 1;
	if(a.ponts > b.points) return -1;
	return 0;
}
/*********************************************************/
function changeDirection(event)
{
	if(breakFlag) return;
	let d = event.key;
	if(d == 'w') player.direction = 1;
	else if(d == 'a') player.direction = 2;
	else if(d == 's') player.direction = 3;
	else if(d == 'd') player.direction = 0;
	player.velocity();
}
/*********************************************************/
function draw()
{
	world.render();
	requestID = window.requestAnimationFrame(draw)
}
/*********************************************************/
function wrongStartPos(posX, posY)
{
	let X = player.posX;
	let Y = player.posY;
	if((posX > X - circleSize*2) && (posY > Y - circleSize*2) && (posX < X + circleSize*2) && (posY < Y + circleSize*2))
	{
		return true;
	}
	return false;
}
/*********************************************************/
function moveTime()
{
	console.log(player.body.state.vx + " " + player.body.vy);
	for(let i = 0 ; i < squares.length ; i++)
	{
		squares[i].decChange();
		squares[i].declifeTime();
		if(squares[i].lifeTime == 0)
		{
			world.removeBody(squares[i].body);
			//delete squares[i];
			let posX = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
			let posY = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
			let vector = Physics.vector();
			vector.set(posX, posY);
			let body = world.findOne({$at: vector});
			if(body || wrongStartPos(posX, posY)) 
			{
				i--;
				continue;
			}
			squares[i] = new Square(posX, posY, lifeTime + Math.floor((Math.random() * 10) + 5), Math.floor((Math.random() * 60) + 10));
			squares[i].create();
		}
		if(squares[i].break) squares[i].break = false;
	}
	if(time == 0)
	{
		clearInterval(intervalID);
		if(round < 3)
		{
			intervalID = setInterval(showBreak, 1000);
			breakFlag = true;
			document.getElementById("modalRound").style.display = "block";
		}
		else moveRound();
	}
	time--;
	showTime();
}
/*********************************************************/
function moveRound()
{
	if(round < 3)
	{
		let am = squares.length;
		for(let i = 0 ; i < am ; i++)
		{
			world.removeBody(squares[0].body);
			squares.shift();
		}

		for(let i = 0 ; i < Math.floor((Math.random() * (20 + squaresAmount)) + 10+ squaresAmount) ; i++)
		{
			let posX = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
			let posY = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
			let vector = Physics.vector();
			vector.set(posX, posY);
			let body = world.findOne({$at: vector});
			if(body || wrongStartPos(posX, posY)) 
			{
				i--;
				continue;
			}
			squares.push(new Square(posX, posY, lifeTime + Math.floor((Math.random() * 10) + 5), Math.floor((Math.random() * 60) + 10)));
			squares[i].create();
		}
		
		gamePoints += player.points;
		playerSpeed *= 1.5;
		change -= 5;
		lifeTime -= 5;
		round++;
		time = 60;
		showTime();
		squaresAmount += 5;
		showRound();
		breakFlag = false;
		document.getElementById("breakSecs").textContent = breakTime;
		intervalID = setInterval(moveTime, 1000);
	}
	else if(round == 3)
	{
		clearInterval(moveTime);
		document.getElementById("modalEnd").style.display = "block";
		
		document.getElementById("points").textContent = "";
		document.getElementById("name").textContent = "";
		if(time >= 0) document.getElementById("time").textContent = "";
		document.getElementById("round").textContent = "";
		
		updateHighscore();
		showHighscore();
		restart();
	}
}
/*********************************************************/
function showBreak()
{
	breakTime--;
	document.getElementById("breakSecs").textContent = breakTime;
	if(breakTime == 0)
	{
		clearInterval(intervalID);
		document.getElementById("modalRound").style.display = "none";
		breakTime = 3;
		moveRound();
	}
}
/*********************************************************/
function showPoints()
{
	document.getElementById("points").textContent = player.points;
}
/*********************************************************/
function showName()
{
	document.getElementById("name").textContent = player.name;
}
/*********************************************************/
function showTime()
{
	if(time >= 0) document.getElementById("time").textContent = time;
}
/*********************************************************/
function showRound()
{
	document.getElementById("round").textContent = round;
}
/*********************************************************/
function showHighscore()
{
	let rows = document.getElementById("bestPlayers").getElementsByClassName("dataRow");
	for(let i = 0 ; i < bestPlayers.length ; i++)
	{
		let col = rows[i].getElementsByTagName("td");
		col[1].textContent = bestPlayers[i].name;
		col[2].textContent = bestPlayers[i].points;
	}
}
/*********************************************************/
function showLogin()
{
	if(!game)
	{
		document.getElementById('modalForm').style.display = "block"
	}
}
/*********************************************************/
function updateHighscore()
{
	bestPlayers.push(player);
	bestPlayers.sort(comparePlayer);
	if(bestPlayers.length > 3) bestPlayers.pop();
}
/*********************************************************/
function restart()
{
	for(let i = 0 ; i < squares.length ; i++)
	{
		world.removeBody(squares[i].body);
	}
	world.removeBody(player.body);
	delete canvas;
	delete world;
	delete renderer;
	delete player;
	delete squares;
	playerSpeed = 0.2;
	change = 20;
	lifeTime = 20;
	squaresAmount = 1;
	gamePoints = 0;
	round = 1;
	breakFlag = false;
	time = 60
	showTime();
	breakTime = 3;
	squares = [];
	clearInterval(intervalID);
	game = false;
	document.getElementById("play").style.display = "block";
}
/*********************************************************/
function start()
{
	if(game) return;
	game = true;
	document.getElementById("play").style.display = "none";
	document.getElementById('modalForm').style.display = "none";
	console.log("Start");
	//inicjalizacja wstępna
	intervalID = setInterval(moveTime, 1000);
	initCanvas();
	world = Physics();
	renderer = Physics.renderer("canvas", { el: "world", width: canvas.width, height: canvas.height, meta: false });	
	world.add(renderer);
	canvas.style.position = 'relative';
	
	//dodawanie zdarzeń
	world.add(Physics.behavior("edge-collision-detection", { aabb: Physics.aabb(0, 0, canvas.width, canvas.height), restitution: 0.05 }));
  	world.add(Physics.behavior("body-impulse-response"));
	world.add(Physics.behavior("body-collision-detection"));
	world.add(Physics.behavior("sweep-prune"));
	
	//tworzenie gracza
	player = new Player(document.forms["Form"]["name"].value, canvas.width / 2, canvas.height / 2);
	player.create();
	document.addEventListener("keyup", changeDirection);
	
	showName();
	showPoints();
	showTime();
	showRound();
	
	//generowanie kwadratów
	for(let i = 0 ; i < Math.floor((Math.random() * (20 + squaresAmount)) + 10 + squaresAmount) ; i++)
	{
		let posX = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
		let posY = Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10);
		let vector = Physics.vector();
		vector.set(posX, posY);
		let body = world.findOne({$at: vector});
		if(body || wrongStartPos(posX, posY)) 
		{
			i--;
			continue;
		}
		squares.push(new Square(posX, posY, lifeTime + Math.floor((Math.random() * 10) + 5), Math.floor((Math.random() * 60) + 10)));
		squares[i].create();
	}
	
	//obsługa kolizji
	world.on('collisions:detected', function( data ){
		var c;
		for (var i = 0, l = data.collisions.length; i < l; i++)
		{
			c = data.collisions[ i ];
			for(let i = 0 ; i < squares.length ; i++)
			{
				if(c.bodyA === player.body && c.bodyB === squares[i].body && !breakFlag && !squares[i].break)
				{
					if(squares[i].state == 'z')
					{
						player.points += squares[i].points;
						squares[i].changeState();
					}
					else
					{
						player.points -= squares[i].points;
					}
					showPoints();
					squares[i].break = true;
				}
				if(c.bodyB === player.body && c.bodyA === squares[i].body && !breakFlag && !squares[i].break)
				{
					if(squares[i].state == 'z')
					{
						player.points += squares[i].points;
						squares[i].changeState();
					}
					else
					{
						player.points -= squares[i].points;
					}
					showPoints();
					squares[i].break = true;
				}
			}
			

		}
	});
	
	Physics.util.ticker.on(function( time, dt ) { world.step( time ); });
	Physics.util.ticker.start();
	
	draw();
	
}
/*********************************************************/
/*********************************************************/