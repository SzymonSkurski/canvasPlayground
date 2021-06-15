class Drone {
    x = 0;
    y = 0;
    speed = 1;
    size = 8;
    vectorX = 1;
    vectorY = 1;
    spark = 0;
    mSLC = 0; //moves since last collision
    constructor(id) {
        this.id = id; //id from drones array
    }
    getCanvas() {
        return document.getElementById('tutorial');
    };
    colisions() {
        this.colisionEdges();
        this.colisisionDrones();
    };
    colisisionDrones() {
        if (this.size < 1) {
            return;//
        }
        drones.forEach(function(drone) {
            if (!drone || drone.id === this.id) {
                return;
            }
            if (drone.size < 1 || !drone.hasColision(this)) {
                return;
            }
            this.mSLC = 0; //has colision reset
            this.bounce(drone);
            if (this.isEven() === drone.isEven()) {
                return;
            }
            if (this.size === drone.size) {
                drone.sparks();
                this.sparks();
            }
            let size = this.size;
            let dSize = drone.size;
            if (size > dSize) {
                drone.size--;
                this.size++
            }
            else {
                this.size--;
                drone.size++;
            }
        }, this);
    };
    isEven() {
        return this.id % 2 === 0;
    }
    momentumX() {
        return this.vectorX * this.size;
    }
    momentumY() {
        return this.vectorY * this.size;
    }
    calcVectors(s1, v1, s2, v2) {
        return Math.ceil(((s1 * v1) - (s1 + v2)) / (s1 + s2));
    }
    bounce(drone) {
        let s1 = this.size;
        let s2 = drone.size;
        let vx1 = this.vectorX;
        let vy1 = this.vectorY;
        let vx2 = drone.vectorX;
        let vy2 = drone.vectorY;
        //central colision
        this.vectorX = vx2;
        this.vectorY = vy2;
        drone.vectorX = vx1;
        drone.vectorY = vy1;

    }
    mathVector(vector) {
        if (vector > 1) return 1;
        if (vector < -1) return -1;
        return vector;
    }
    eat(size) {
        this.size ++;
        // if (this.speed > 1) this.speed --;
        // this.revertVectors();
    }
    blink() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    hasColision(d) {
        return ((d.y >= this.y - d.size && d.y <= this.y + this.size)
            && (d.x >= this.x - d.size && d.x <= this.x + this.size));
    };
    getCenterTile() {
        let s = this.size;
        if (!s) return [];
        if (s === 1) return [this.x, this.y];
        let d = s % 2 ? Math.ceil(s / 2) : Math.floor(s / 2);
        return [this.x + d, this.y + d];
    };
    addMSLC() {
        this.mSLC++;
    }
    colisionEdges() {
        let canvas = this.getCanvas();
        if (this.x + this.size > canvas.width) this.vectorX = -1; //right edge colision
        if (this.y + this.size > canvas.height) this.vectorY = -1; //bottom edge colision
        if (this.x < 0) this.vectorX = 1; //left edge colision
        if (this.y < 0) this.vectorY = 1; //bottom edge colision
        if (this.hasEdgeColision()) {
            this.mSLC = 0; //has colision reset
            this.colissionRandEffects()
        };
    };
    hasEdgeColision() {
        let canvas = this.getCanvas();
        return (this.x + this.size > canvas.width ||
            this.y + this.size > canvas.height ||
            this.x < 0 || this.y < 0
        );
    }
    draw() {
        if (!this.size) return;
        // this.drawTraceTriangle();
        // this.drawTriangle();
        this.drawTraceRectangle();
        this.drawRectangle();
        // this.drawTraceCircle();
        // this.drawCircle();
    };
    drawTraceCircle() {
        this.drawTrace(this.drawCircle);
    }
    drawCircle(op = 1) {
        let ctx = this.getCanvas().getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2,true); // Outer circle
        ctx.fillStyle = 'rgb(' + this.colorRGB.join() + ',' + op + ')';
        ctx.fill();
    }
    drawTraceTriangle() {
        this.drawTrace(this.drawTriangle);
    }
    drawTriangle(op = 1) {
        let ctx = this.getCanvas().getContext('2d');
        let hs = Math.ceil(this.size / 2) || 1;
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x + hs, this.y + hs);
        ctx.lineTo(this.x + this.size,this.y);
        ctx.lineTo(this.x, this.y);
        ctx.fillStyle = 'rgb(' + this.colorRGB.join() + ', ' + op + ')';
        ctx.fill();
    }
    drawTraceRectangle() {
        this.drawTrace(this.drawRectangle);
    }
    drawRectangle(op = 1, rgb = []) {
        let canvas = this.getCanvas();
        let ctx = canvas.getContext('2d');
        rgb = rgb.length === 3 ? rgb : this.colorRGB;
        ctx.fillStyle = 'rgb(' + rgb.join() + ', ' + op + ')';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    drawTrace(drawCallback) {
        let x = this.x; //store current
        let y = this.y;
        let t = Math.min(4, this.mSLC); //how many traces, max 3
        let rgb = [255,255,155]; //trace color
        while(t > 1) {
            t--;
            this.moveBack();
            drawCallback.apply(this, [(t * 2) / 10, rgb]);
        }
        this.x = x;
        this.y = y; //restore to previos
    }
    destroy() {
        this.size = 0;
        drones[this.id] = null;
    }
    sparks() {
        if (this.size < 4) {
            this.revertVectors();
            // this.destroy();
            return; //drone cannot spark any more is over
        }
        let expSize = Math.ceil(this.size / 4);
        let x = this.x;
        let y = this.y;
        //this drone go right down
        this.vectorX = 1;
        this.vectorY = 1;
        this.x = x + expSize;
        this.y = y + expSize;
        this.spark = this.size;
        this.size = expSize; //split half
        //create new drone going left top
        this.createClone(x - expSize, y - expSize, -1, -1, expSize); //left top
        this.createClone(x - expSize, y + expSize, -1, 1, expSize); //left down
        this.createClone(x + expSize, y - expSize, 1, -1, expSize); //right top
    };
    createClone(x, y, vectorX, vectorY, size) {
        let rDrone = new Drone(drones.length || 0);
        rDrone.vectorX = vectorX;
        rDrone.vectorY = vectorY;
        rDrone.size = size;
        rDrone.x = x;
        rDrone.y = y;
        rDrone.speed = this.speed;
        rDrone.colorRGB = this.colorRGB;
        rDrone.spark = this.spark;
        drones.push(rDrone);
    }
    resetXY() {
        if (this.vectorX > 0) {
            this.x = this.x + this.size;
        }
    };
    move() {
        if (!this.size) return;
        this.x += this.vectorX * this.speed;
        this.y += this.vectorY * this.speed;
    };
    moveBack() {
        if (!this.size) return;
        this.x -= this.vectorX * this.speed;
        this.y -= this.vectorY * this.speed;
    }
    getTiles() {
        let tiles = [];
        let x = this.x;
        let maxX = x + this.size;
        let y = this.y;
        let maxY = y + this.size;
        for (x; x <= maxX; x++) {
            for (y; y <= maxY; y++) {tiles.push(x + '|' + y);}
        }
        return tiles;
    };
    getVectorX(r = false) {
        return r ? this.vectorX * -1 : this.vectorX;
    }
    getVectorY(r = false) {
        return r ? this.vectorY * -1 : rthis.vectorY;
    }
    revertVectors() {
        this.vectorX *= -1;
        this.vectorY *= -1;
    };
    setRandomXY() {
        let canvas = this.getCanvas();
        let maxX = canvas.width - this.size;
        let maxY = canvas.height - this.size;
        let minX = Math.floor(canvas.width / 2);
        let minY = Math.floor(canvas.height / 2);
        if (this.isEven()) {
            maxX = Math.floor(canvas.width / 2) - this.size;
            maxY = Math.floor(canvas.height / 2) - this.size;
            minX = 0;
            minY = 0;
        }
        this.x = randInt(minX, maxX);
        this.y = randInt(minY, maxY);
    }
    //return rand -1 || 0 || 1
    getRandVector(allowZero = true) {
        return allowZero
            ? randInt(-1, 2)
            : randInt(0, 2) || -1;
    }
    setRandomVectors() {
        this.vectorX = this.getRandVector();
        this.vectorY = this.getRandVector();
        if (this.vectorX + this.vectorY === 0) {
            !randInt(0, 2)
                ? this.vectorX = this.getRandVector(false)
                : this.vectorY = this.getRandVector(false);
        }
        // this.vectorX = randInt(0, 2) || -1;
        // this.vectorY = randInt(0, 2) || -1;
    }
    setRandomRGB() {
        this.colorRGB = [randInt(0, 255), randInt(0, 255), randInt(0, 255)];
    };
    setRGBFoF() {
        this.colorRGB = this.isEven() ? [0,0,255] : [255,255,255];
    }
    colissionRandEffects() {
        let r = randInt(1, 20);
        // if (r === 1 && this.size > 2) {
        //   if (this.speed < 10) this.speed++; //max speed 10
        //   this.size--;
        // }
        // if (r === 2) {
        //   this.size++;
        //   if (this.speed > 1) this.speed--; //avoid speed 0
        // }
        if (r === 3) this.vectorX *= -1; //turn x
        if (r === 4) this.vectorY *= -1; //turn y
        if (r === 5) this.x+= randInt(1, 10) * this.vectorX; //jump x
        if (r === 6) this.y+= randInt(1, 10) * this.vectorY; //jump y
    }
}