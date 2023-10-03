var bunny = document.querySelector("#bunny");
var root = document.querySelector("#root");

function abc() {
    let a = 1;
    let b = 1;
    let direction = 1; // 1 for moving right, -1 for moving left
    const avs = setInterval(function () {
        if (a === 5) {
            b++;
            direction = -1;
            a += direction;
        } else if (a === 1 && b !== 1) {
            b++;
            direction = 1;
            a += direction;
        } else {
            a += direction;
            
        }
        bunny.style.gridColumnStart = a;
        bunny.style.gridRowStart = b;
        if (b ===  5 && a === 5) {
            clearInterval(avs);
        }
    }, 400);
}
