

let drones = [];

function randInt(min, max)
{
    return Math.floor(Math.random() * (+ max - + min)) + +min;
};

function range(start, end) {
    let r = [];
    if (start === end) {
        return r;
    }
    let s = Math.min(start, end);
    let e = Math.max(start, end);
    while(s <= e) {
        r.push(s);
        s++;
    }
    return r;
};

function addDrone() {
    let drone = new Drone(drones.length || 0);
    // drone.setRandomRGB();
    drone.setRGBFoF();
    drone.setRandomXY();
    drone.setRandomVectors();
    drones.push(drone);
}

function clearCanvas() {
    let canvas = document.getElementById('tutorial');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function run() {
    clearCanvas();
    drones.forEach(function(drone) {
        if (!drone) {
            return;
        }
        if (drone.size < 1) {
            drone.destroy();
            return;
        }
        drone.move();
        drone.addMSLC(); //count moves since last colision
        drone.colisions();
        drone.draw();
    });
};

let d = 100;
while (d > 0) {
    addDrone();
    d--;
}
setInterval(run, 33);