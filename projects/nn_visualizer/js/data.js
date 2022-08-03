const canvas = document.getElementById("datacanvas");
const context = canvas.getContext('2d');

var nodes = [];
var red = false;

function drawNode(node) {
    context.beginPath();
    context.fillStyle = node.fillStyle;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    context.strokeStyle = node.strokeStyle;
    context.stroke();
    context.fill();
}

function click(e) {
    let rect = canvas.getBoundingClientRect();

    if (red) {
        let node = {
            x: e.x - rect.left,
            y: e.y - rect.top,
            label: 1,
            radius: 5,
            fillStyle: 'red',
            strokeStyle: 'black'
        };
    
        nodes.push(node);
        drawNode(node);
    } else {
        let node = {
            x: e.x - rect.left,
            y: e.y - rect.top,
            label: 0,
            radius: 5,
            fillStyle: 'blue',
            strokeStyle: 'black'
        };
    
        nodes.push(node);
        drawNode(node);
    }    
}

function toggle(e) {
    if(e.key.toUpperCase() == "T") {
        red = !red;
    }
}

window.onclick = click;
window.onkeyup = toggle;
