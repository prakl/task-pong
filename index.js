// класс определяющий параметры игрового прямоугольника и метод для его отрисовки
function rect(color, x, y, width, height) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };
}
// движение игрока
function playerMove(e) {
    var x = e.pageX;
    if (player.width / 2 + 10 < x && x < game.width - player.width / 2 - 10) {
        player.x = x - player.width / 2;
    }
}
// отрисовка игры
function draw() {
    game.draw(); // рисуем игровое поле
    // рисуем на поле счёт
    context.font = 'bold 48px courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#ccc';
    context.fillText('Your scores: ' + player.scores, 220, 0);
    player.draw();
	ball.draw();
	bonusOne.draw();
	bonusTwo.draw(); 
}

// Изменения которые нужно произвести
function update(requestID) {
    // меняем координаты шарика
    // Движение по оси У
    if (ball.y+ball.height>game.height) {
       	stopGame(requestID);
    }
	if (ball.y<0) {
		ball.vY = -ball.vY;
	}
    // Движение по оси Х
    if (ball.x<0) {
        // столкновение с левой стеной
        ball.vX = -ball.vX;
    }
    if (ball.x+ball.width>game.width) {
        // столкновение с правой
        ball.vX = -ball.vX;
    }
    // Соприкосновение с ракетками
    if (collision(player, ball) && ball.vY>0){
        ball.vY = -ball.vY;
		ball.vY *= 1.05;
		ball.vX *= 1.05;
		player.scores ++;
    }
	
	if (bonusTwo.y+bonusTwo.height>game.height) {
        resetBonus();
    }
	
	if (bonusOne.x<0) {
        // столкновение с левой стеной
        bonusTwo.vX = -bonusTwo.vX;
		bonusOne.vX = -bonusOne.vX;
    }
	
	if (bonusOne.x+bonusOne.width>game.width) {
        // столкновение с правой
        bonusTwo.vX = -bonusTwo.vX;
		bonusOne.vX = -bonusOne.vX;
    }
	
	if (collision(player, bonusTwo) && bonusTwo.vY>0){
		player.scores += 15;
        resetBonus();
	}
    // приращение координат
    ball.x += ball.vX;
    ball.y += ball.vY;
    if (!bonusPaused) {
        bonusOne.x += bonusOne.vX;
        bonusTwo.x += bonusTwo.vX;
        bonusOne.y += bonusOne.vY;
        bonusTwo.y += bonusTwo.vY;
    }
}

function play() {
    draw(); // отрисовываем всё на холсте
	requestID = requestAnimationFrame(play);
    update(requestID); // обновляем координаты
}

function resetBonus() {
    console.log('reset');
    bonusOne.x = game.width / 2 - 20;
    bonusTwo.x = game.width / 2;
    bonusOne.y = 75;
    bonusTwo.y = 55;
    bonusOne.color = "rgba(255, 255, 255, 0)";
    bonusTwo.color = "rgba(255, 255, 255, 0)";
    bonusPaused = true;
    setTimeout(function() {
        bonusOne.color = "#f00";
        bonusTwo.color = "#f00";
        bonusPaused = false;
    }, 3000);
}


function collision(objA, objB) {
    if (objA.x+objA.width  > objB.x &&
        objA.x             < objB.x+objB.width &&
        objA.y+objA.height > objB.y &&
        objA.y             < objB.y+objB.height) {
            return true;
        }
        else {
            return false;
            }
    }
function drawBall(color, x, y, width, height) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = function() {
    context.beginPath();
    context.arc(this.x, this.y, 15, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}
}

function stopGame(){
	context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = 'bold 48px courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#000';
    context.fillText('Your scores: ' + player.scores, window.innerWidth/2, window.innerHeight/2);
	cancelAnimationFrame(requestID);
}

	
// Инициализация переменных
function init() {
    // объект который задаёт игровое поле
    game = new rect("#fff", 0, 0, window.innerWidth - 10, window.innerHeight);
    // Ракетка
    player = new rect("#000", game.width / 2, game.height - 60, 200, 30);
    // количество очков
    player.scores = 0;
	bonusOne = new rect("#f00", game.width / 2 - 20, 75, 50, 10);
	bonusTwo = new rect("#f00", game.width / 2, 55, 10, 50);
    ball = new drawBall("#000", 40, game.height / 2 - 10, 20, 20);
    // скорость шарика
    ball.vX = 10; // скорость по оси х
    ball.vY = 10; // скорость по оси у
	bonusOne.vX = 5;
	bonusOne.vY = 5;
	bonusTwo.vX = 5;
	bonusTwo.vY = 5;
    canvas = document.getElementById("pong");
    canvas.width = game.width;
    canvas.height = game.height;
    context = canvas.getContext("2d");
    canvas.onmousemove = playerMove;
    bonusPaused = false;
	play();
}