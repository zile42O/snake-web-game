/**************************************************
*
*	Written by Zile
*	Date created: 25/02/2018
*
****************************************************/

// DOM elements
const infoBoard        = document.getElementById('info-board');
const resetButtonGame  = document.getElementById('button-reset-game');
const resetButtonScore = document.getElementById('button-reset-score');
const changeButtonTheme = document.getElementById('button-change-theme');
// vars
var score = 0;
var theme = "Default";
var resettimes = 0;
var canvas = $("#canvas")[0];
var ctx = canvas.getContext("2d");
var w = $("#canvas").width();
var h = $("#canvas").height();
var cw = 10;
var d;
var food;	
var snake_array; 
// ------------ Init Game ------------
initGame();
// -----------------------------------
function resetGame() {
	create_snake();
	create_food(); 
	updateBoardInfo();
}

function updateBoardInfo() {
	infoBoard.innerHTML = 'Snake Score: ' + score + '<br>'
						+ 'Theme: ' + theme + '<br>'
						+ 'Reset Times: ' + resettimes;				
}

function showFinishDialog(msg) {
	alert(msg);
	resetGame();
}

document.addEventListener('contextmenu', function(e) { //block inspect element
  e.preventDefault();
});

function initGame() {

	

	//snake
	d = "right"; //default direction
	create_snake();
	create_food(); //Now we can see the food particle
	

	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 100);


	//reset clicks	

	resetButtonGame.addEventListener('click', function() {
		if(resettimes > 1000) return alert("Ne mozete vise resetovati igru, refreshujte stranicu!");
		resettimes++;
		resetGame();
		create_snake();
		create_food(); 
	});
	resetButtonScore.addEventListener('click', function() {
		if(score < 1) return alert("Ne mozete resetovati score kada je on na nuli!")
		score = 0;
		updateBoardInfo();

	})
	changeButtonTheme.addEventListener('click', function() {
		if(theme == "Default")
		{
			theme = "Dark";
		}
		else 
		{
			theme = "Default";
		}	
		updateBoardInfo();

	})
	// Init board
	updateBoardInfo();

}
	
function create_snake()
{
	var length = 5; 
	snake_array = []; 
	for(var i = length-1; i>=0; i--)
	{
		snake_array.push({x: i, y:0});
	}

}
	
function create_food()
{
	food = {
		x: Math.round(Math.random()*(w-cw)/cw), 
		y: Math.round(Math.random()*(h-cw)/cw), 
	};
}
function paint()
{
	ctx.fillRect(0, 0, w, h);
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;
	
	if(d == "right") nx++;
	else if(d == "left") nx--;
	else if(d == "up") ny--;
	else if(d == "down") ny++;
	
	
	if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
	{		
		resetGame();
		return;
	}
	if(nx == food.x && ny == food.y)
	{
		var tail = {x: nx, y: ny};
		score++;   
		create_food();
	}
	else
	{
		var tail = snake_array.pop(); 
		tail.x = nx; tail.y = ny;
	}
	snake_array.unshift(tail);
	if(theme == "Dark")
	{
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y, "#79e978");
		}	
		paint_cell(food.x, food.y, '#267c2b');
		chBackcolor("#0f0f0f");//background black
		ctx.fillStyle = "#0f0f0f";
		
	}
	else 
	{
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y, "powderblue");
		}	
		paint_cell(food.x, food.y, '#e99878');
		theme = "Default";
		chBackcolor("#B0E0E6");
		ctx.fillStyle = "#8CB3B8";
	}		

	updateBoardInfo();
}
	
function chBackcolor(color) {
   document.body.style.background = color;
}	

function paint_cell(x, y, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x*cw, y*cw, cw, cw);
}
	
function check_collision(x, y, array)
{
	for(var i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y)
		 return true;
	}
	return false;
}
	
$(document).keydown(function(e){
	var key = e.which;
	//We will add another clause to prevent reverse gear
	if(key == "37" && d != "right") d = "left";
	else if(key == "38" && d != "down") d = "up";
	else if(key == "39" && d != "left") d = "right";
	else if(key == "40" && d != "up") d = "down";
	//The snake is now keyboard controllable
})

