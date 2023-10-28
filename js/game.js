class Game {
    constructor(width, height, newGame) {
        this.width = width;
        this.height = height;
        this.newGame = newGame;
        /*
        El método this.grid consiste en un array 2D (recto, representa
        las filas) que a su vez tiene un .map que hace que se generen
        X cantidad de columnas por cada fila. En este caso serán 30
        porque le pasaremos 30 en el constructor del new SnakeGame.
        El .fill se pone en null porque significa que por defecto
        no hay snake ni food, es decir, es un espacio del grid vacío.
        Esto más adelante en el generateFood también se usa para
        determinar si una casilla está vacía o no para generar
        el food.
        */
        this.grid = new Array(height).fill(null).map(() => new Array(width).fill(null));
        this.snake = [{ x: 15, y: 15 }];
        this.direction = null;
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;

        this.gameScreen = document.querySelector(".game-screen");
        this.scoreElement = document.getElementById("score");
        this.scoreElement.innerHTML = `SCORE ${this.score}`;
            console.log(this.snake)
        // para que el juego pueda empezar presionando una flecha
        document.addEventListener("keydown", (event) => {
            if (
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight"
            ) {
                this.startGame();
            }
        });
    }

    generateFood() {

        // variables inicialmente vacías
        let foodX;
        let foodY;

        while (true) {
            // genera un número de coordenada aleatorio
            foodX = Math.floor(Math.random() * this.width);
            foodY = Math.floor(Math.random() * this.height);
            // si la casilla está vacía (no hay serpiente), párame el loop...
            if(!this.grid[foodY][foodX]) {
                break;
            }
        }
        // ...y devuélveme la posición
        return {x: foodX, y: foodY};
    }

    moveSnake() {

        // definición de serpiente y creación de copia
        const snakeHead = {...this.snake[0]};

        /*
        suma o resta 1 en coordenadas x o y en función de qué
        hay en el atributo this.direction arriba
        */
        switch(this.direction) {
            case "up":
                snakeHead.y--;
                break;
            case "down":
                snakeHead.y++;
                break;
            case "left":
                snakeHead.x--;
                break;
            case "right":
                snakeHead.x++;
                break;
        }

        // agregar una nueva snakeHead al array this.snake
        this.snake.unshift(snakeHead);

        // detección de choque y generación de nueva food si sucede + score
        if (snakeHead.x === this.food.x && snakeHead.y === this.food.y) {
            this.food = this.generateFood();
            this.score++;
            this.scoreElement.innerHTML = `SCORE ${this.score}`;
        
        /*
        si no ha comido la comida, significa que simplemente la
        snake se mueve. El else gestiona eso, quitando el tail
        para simular el movimiento
        */
        } else {
            // quita un cuadradito del snake
            const tail = this.snake.pop();
            // deja la grid vacía
            this.grid[tail.y][tail.x] = null;
        }

        // si hay un gameOver, para el setInterval. Si no, sigue
        if(this.gameOver === true) {
            clearInterval(intervalId);
        } else {
            this.updateGrid();
        }

    }

    /*
    para prevenir que el jugador no haga reverse inmediatamente,
    cosa que originaría chocarse contra el propio cuerpo de la
    serpiente y perder
    */
    changeDirection(directionPressed) {
        if(
            (directionPressed === "up" && this.direction !== "down") || 
            (directionPressed === "down" && this.direction !== "up") || 
            (directionPressed === "left" && this.direction !== "right") || 
            (directionPressed === "right" && this.direction !== "left")
        ) {
            this.direction = directionPressed;
            
        }
    }

    isGameOver() {
        const snakeHead = this.snake[0];

        /* si la serpiente cruza los límites de las coordenadas,
        game over */
        if (
            snakeHead.x < 0 ||
            snakeHead.x >= this.width ||
            snakeHead.y < 0 ||
            snakeHead.y >= this.width
        ) {
            this.gameOver = true;
            return;
        }

        /* detectar una self-collision, comparando las coordenadas
        de la cabeza con las del resto del cuerpo. Si coinciden,
        eso significa que debe haber sido una colisión. Game over
        */
       for (let i = 1; i < this.snake.length; i++) {
        /* comparar coordenadas con cada elemento del snake array
        con cada iteración */
            if(snakeHead.x === this.snake[i].x && snakeHead.y === this.snake[i].y) {
                this.gameOver = true;
                return;
            }
        }

        // si nada de eso sucede se sigue jugando
        this.gameOver = false;
    }

    startGame() {

        // mostrar el juego
        this.displayGrid();
        this.moveSnake();
        this.updateGrid();
        
        // iniciar el intervalo de la serpiente al mismo tiempo que
        // se mueve la misma y se actualiza el terreno de juego
        // this.intervalId = setInterval(() => {
        //     
        // }, 125);
    }
    
    restartGame() {

        // restaurar a los valores originales
        this.snake = [{ x: 15, y: 15 }];
        this.direction = null;
        this.food = this.generateFood();
        this.intervalId = null;
        this.score = 0;

        // volver a empezar el juego
        this.startGame();
    }

    // función que "refresca" el grid para matchear el estado actual del juego
    updateGrid() {

        // reinicializar el grid para quitar el estado anterior
        this.grid = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));

        // marca las casillas donde el snake está localizado
        this.snake.forEach((partOfSnake) => {
            this.grid[partOfSnake.y][partOfSnake.x] = "snake";
        });

        // marca la casilla donde el food está localizado
        this.grid[this.food.x][this.food.y] = "food";
    }

    // genera y muestra todo el contenido en pantalla
    displayGrid() {
        // referencia del gameScreen, ubicado en el constructor
        const gameScreen = this.gameScreen;
        // inicializar gameScreen a un string vacío
        gameScreen.innerHTML = '';

        // iterar por las rows (y)
        for (let y = 0; y < this.height; y++) {
            // creación de las grid-row
            const row = document.createElement("div");
            row.className = "grid-row";
            // iterar por las columnas (x)
            for(let x = 0; x < this.width; x++) {
                // creación de las grid-cell
                const cell = document.createElement("div");
                cell.className = "grid-cell";

                // si es snake o food, añádele la clase
                if (this.grid[y][x] === "snake") {
                    cell.classList.add("snake");
                } else if (this.grid[y][x] === "food") {
                    cell.classList.add("food");
                }

                // añade las cells a los grid-row como hijos
                row.appendChild(cell);
            }

            // añade los rows al gameScreen
            gameScreen.appendChild(row);
            this.updateGrid();
        }
    }
}

let newGame;

window.onload = () => {
    
    newGame = new Game(30, 30, newGame);

    /* restart, ejecutando la función de dentro de la clase 
    una vez pulsado el botón */
    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        newGame.restartGame();
    });
   
    // handleKeydown, que detecte el teclado
    document.addEventListener("keydown", (event) => {
        switch(event.key) {
            /* en el caso de que se presione una tecla,
            haz que entre un parámetro en .changeDirection,
            que cambiará la dirección en la clase */
            case "ArrowUp":
                newGame.changeDirection("up");
                break;
            case "ArrowDown":
                newGame.changeDirection("down");
                break;
            case "ArrowLeft":
                newGame.changeDirection("left");
                break;
            case "ArrowRight":
                newGame.changeDirection("right");
                break;
            }
    });
}

// inicialización del juego posterior a que todo lo demás esté cargado
/* document.addEventListener("DOMContentLoaded", () => {
    newGame = new Game(30, 30);
}); */