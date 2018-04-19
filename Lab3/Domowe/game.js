const squareSize = 50
const circleSize = 20
let playerSpeed = 0.1;
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
function Square(lifeTime, posX, posY)
{
	this.lifeTime = lifeTime;
	this.change = 5;
	this.state = 'z';
	this.posX = posX;
	this.posY = posY;
	this.points = 10;
	
	this.create = function()
	{
		this.body = Physics.body('rectangle', { x: posX, y: posY, vx: 0.0, vy: 0.0, height: 50, width: 50, 
											   styles: {fillStyle: "#10d140",lineWidth: 1 }});
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
			this.body.view = null;
		}
		else 
		{
			this.state = 'z';
			this.body.styles.fillStyle = "#10d140";
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
		this.body = Physics.body('circle', {x: posX, y: posY, vx: 0.02, vy: 0.00, radius: 25,
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
	console.log(player.body.state.vx);
}
/*********************************************************/
function drawBackground()
{
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#8fb6c1";
	ctx.fill();
	ctx.closePath();
}
/*********************************************************/
function drawSquares()
{
	for(let i = 0 ; i < squares.length ; i++)
	{
		squares[i].draw();
	}
}
/*********************************************************/
function draw()
{
	//drawBackground();
	//drawSquares();
	//player.actPosition();
	//player.draw();
	world.render();
	requestID = window.requestAnimationFrame(draw)
}
/*********************************************************/
function decLifetime()
{
	for(let i = 0 ; i < squares.length ; i++)
	{
		squares[i].declifeTime();
		squares[i].decChange();
	}
}
/*********************************************************/
function showPoints()
{
	document.getElementById("points").textContent = player.points;
}

Physics.body('square', 'rectangle', function (parent) {
      var canv = document.createElement('canvas');
      canv.width = squareSize;
      canv.height = squareSize;
      var ctx  = canv.getContext("2d");

      return {
           // Called when the body is initialized
           init: function(options) {
               parent.init.call(this, options);
			   ctx.fillStyle = options.styles.fillStyle;
      		   ctx.fillRect(0,0,squareSize,squareSize);
			   ctx.fillStyle = "#000000";
			   ctx.textAlign = "center"
			   ctx.textBaseline = "middle";
			   ctx.font = "15px sans-serif";
               ctx.fillText("50",squareSize / 2,squareSize / 2);
            },
            // Called when the body is added to a world
            connect: function() {
                this.view = canv;
            }
      }
  });
/*********************************************************/
function start()
{
	intervalID = setInterval(decLifetime, 1000);
	initCanvas();
	world = Physics();
	renderer = Physics.renderer("canvas", { el: "world", width: canvas.width, height: canvas.height, meta: false });	
	world.add(renderer);
	canvas.style.position = 'relative';
	
	world.add(Physics.behavior("edge-collision-detection", { aabb: Physics.aabb(0, 0, canvas.width, canvas.height), restitution: 0.01 }));
  	world.add(Physics.behavior("body-impulse-response"));
	world.add(Physics.behavior("body-collision-detection"));
	world.add(Physics.behavior("sweep-prune"));

	player = new Player("Jan", 40, 40);
	player.create();
	document.addEventListener("keyup", changeDirection);
	
	for(let i = 0 ; i < 10 ; i++)
	{
		squares.push(new Square(40, 10+50*i, 10+50*1));
		squares[i].create();
	}
	
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
						player.points += 10;
					}
					else
					{
						player.points -= 10;
					}
					showPoints();
				}
				if(c.bodyB === player.body && c.bodyA === squares[i].body)
				{
					if(squares[i].state == 'z')
					{
						player.points += 10;
					}
					else
					{
						player.points -= 10;
					}
					showPoints();
				}
			}
			

		}
	});
	let text = Physics.body('square', {
     x: 50,
     y: 570,
     width: 50,
     height: 50,
     points: 50, styles: {
								fillStyle: "#e5c422"
								,lineWidth: 1
								
							}
 });
	world.add(text);
	text.styles.fillStyle = "#e5c422";
	$("#world").click(function(e) {
		console.log("dd");
		//pl.accelerate(0.1);
		var offset = $(this).offset();
		var px = e.pageX - offset.left;
		var py = e.pageY - offset.top;
		// this is the way physicsjs handles 2d vectors, similar at Box2D's b2Vec
		var mousePos = Physics.vector();
		mousePos.set(px,py);
		// finding a body under mouse position
		var body = world.findOne({
			$at: mousePos
		})
		// there isn't any body under mouse position, going to create a new box
		if(!body){
			body = Physics.body('rectangle', {
						x: px,
						y: py,
						vx: 0.01, vy: 0.1,height:50,
						width: 50,styles: {
								fillStyle: '0xd33682'
								,lineWidth: 1
								
							}
					});
			
			body.state.vel.set(-1,1);
			world.add(body);
		}
		else{
			// there is a body under mouse position, let's remove it
			world.removeBody(body);
		} 
	})
	
	Physics.util.ticker.on(function( time, dt ){
    world.step( time );
});

// start the ticker
Physics.util.ticker.start();
}
/*********************************************************/
/*********************************************************/
/*********************************************************/