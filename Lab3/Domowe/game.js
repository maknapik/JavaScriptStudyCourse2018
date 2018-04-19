const squareSize = Math.floor((document.documentElement.clientWidth > document.documentElement.clientHeight ? document.documentElement.clientWidth : document.documentElement.clientHeight) / 40);
const circleSize = Math.floor(document.documentElement.clientWidth / 80);
let playerSpeed = 0.3;
let change = 20;
let squaresAmount = 1;
/*********************************************************/
let gamePoints = 0;
let round = 1;
/*********************************************************/
let time = 60;
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
let rvalID;
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
	this.lifeTime = lifeTime;
	this.change = change;
	this.state = 'z';
	this.posX = posX;
	this.posY = posY;
	this.points = points;
	
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
		this.body = Physics.body('circle', {x: posX, y: posY, vx: 0.02, vy: 0.00, radius: circleSize,
											styles: { fillStyle: "#134693" , lineWidth: 1 }});
		this.body.state.vel.set(playerSpeed, 0);
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
function changeDirection(event)
{
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
function moveTime()
{
	for(let i = 0 ; i < squares.length ; i++)
	{
		squares[i].decChange();
		squares[i].declifeTime();
		if(squares[i].lifeTime == 0)
		{
			world.removeBody(squares[i].body);
			//delete squares[i];
			squares[i] = new Square(Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * 40) + 10), Math.floor((Math.random() * 70) + 10));
			squares[i].create();
		}
	}
	time--;
	if(time == 0)
	{
		let am = squares.length;
		for(let i = 0 ; i < am ; i++)
		{
			world.removeBody(squares[0].body);
			squares.shift();
		}
		console.log("len: " + squares.length);
		for(let i = 0 ; i < Math.floor((Math.random() * (20 + squaresAmount)) + 10+ squaresAmount) ; i++)
		{
			squares.push(new Square(Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * 40) + 10), Math.floor((Math.random() * 70) + 10)));
			squares[i].create();
		}
		
		gamePoints += player.points;
		playerSpeed *= 2;
		change -= 5;
		round++;
		time = 60;
		squaresAmount += 5;
		showRound();
	}
	showTime();
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
	document.getElementById("time").textContent = time;
}
/*********************************************************/
function showRound()
{
	document.getElementById("round").textContent = round;
}
/*********************************************************/
function start()
{
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
	player = new Player("Jan", 40, 40);
	player.create();
	document.addEventListener("keyup", changeDirection);
	
	showName();
	showPoints();
	showTime();
	showRound();
	
	//generowanie kwadratów
	for(let i = 0 ; i < Math.floor((Math.random() * (20 + squaresAmount)) + 10+ squaresAmount) ; i++)
	{
		squares.push(new Square(Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * (canvas.width - squareSize*2)) + 10), Math.floor((Math.random() * 40) + 10), Math.floor((Math.random() * 70) + 10)));
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
				if(c.bodyA === player.body && c.bodyB === squares[i].body)
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
				}
				if(c.bodyB === player.body && c.bodyA === squares[i].body)
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
				}
			}
			

		}
	});
	
	Physics.util.ticker.on(function( time, dt ) { world.step( time ); });
	Physics.util.ticker.start();
}
/*********************************************************/
/*********************************************************/
/*********************************************************/