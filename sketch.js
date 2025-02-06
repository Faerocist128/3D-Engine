//wasd for forward, left, back, right
//arrow keys for rotation
//space bar for up and shift for down


//x is w, y is h, z is depth
let w = 1000;//dictates the dimensions of our 2d screen
let h = 600;
let n = [0,0,500];//normal vector of cam plane
let o = [100,100,-200];//start point for cam
let xax = [];
let yax = [];
let d0 = 0.75;//rotation step size in degrees
let dl = 3;

let bounded = true;
//array…
let rotl = false;
let rotr = false;
let rotu = false;
let rotd = false;

let movl = false;
let movr = false;
let movu = false;
let movd = false;
let movf = false;
let movb = false;


function setup() {
  createCanvas(w, h);
  //noStroke();
  stroke(0);
  
  //fill(255, 0, 0);
  
}

function motion() {
  
  let scl = dl/sqrt(n[0]**2 + n[2]**2);
  
  if (movl) {
    o[0] -= scl*n[2];
    o[2] += scl*n[0];
  }
  else if (movr) {
    o[0] += scl*n[2];
    o[2] -= scl*n[0];
  }
  else if (movu) {
    o[1] += dl;
  }
  else if (movd) {
    o[1] -= dl;
  }
  else if (movf) {
    o[0] += scl*n[0];
    o[2] += scl*n[2];
  }
  else if (movb) {
    o[0] -= scl*n[0];
    o[2] -= scl*n[2];
  }
  
  let x = n[0], y = n[1], z = n[2];
  let drad = d0*PI/180;
  
  if (rotl) {
    n[0] = n[0]*cos(drad) - z*sin(drad);
    n[2] = n[2]*cos(drad) + x*sin(drad);
  }
  else if (rotr) {
    n[0] = n[0]*cos(drad) + z*sin(drad);
    n[2] = n[2]*cos(drad) - x*sin(drad);
  }
  else if (rotu) {
    n[0] = x*cos(drad) - (x*y*sin(drad)/sqrt(x**2 + z**2));
    n[2] = z*cos(drad) - (y*z*sin(drad)/sqrt(x**2 + z**2));
    n[1] = y*cos(drad) + sin(drad)*sqrt(x**2 + z**2);
  }
  else if (rotd) {
    n[0] = x*cos(drad) + (x*y*sin(drad)/sqrt(x**2 + z**2));
    n[2] = z*cos(drad) + (y*z*sin(drad)/sqrt(x**2 + z**2));
    n[1] = y*cos(drad) - sin(drad)*sqrt(x**2 + z**2);
  }
  
  xax = [n[2],0,-n[0]];
  yax = [n[0]*n[1], -(n[0]**2 + n[2]**2), n[1]*n[2]];
}


function dp(a,b) {//DOT PRODUCT
  return (a[0]*b[0]) + (a[1]*b[1]) + (a[2]*b[2]);
}

function cp(a, b) {//CROSS PRODUCT
  let ans = [0,0,0];
  ans[0] = b[2]*a[1] - b[1]*a[2];
  ans[1] = b[0]*a[2] - b[2]*a[0];
  ans[2] = b[1]*a[0] - b[0]*a[1];
  
  return ans;
}

function l(v) {//MAGNITUDE OF VECTOR
  return sqrt(v[0]**2 + v[1]**2 + v[2]**2);
}

function proj(b,a) {//VECTOR PROJECTION OF B ONTO A
  
  let adb = dp(a,b);
  let ans = [a[0],a[1],a[2]];
  
  ans[0] *= adb/l(a)**2;
  ans[1] *= adb/l(a)**2;
  ans[2] *= adb/l(a)**2;
  
  return ans;
}

function sproj(b,a) {//SCALAR PROJECTION OF B ONTO A
  return dp(a,b)/l(a);
}

class Triangle {
    
  constructor(a,b,c,clr,stkw,stkclr) {//a, b, c are xyz coords
    this.a = a;
    this.b = b;
    this.c = c;
    this.clr = clr;
    this.stkw = stkw;
    this.stkclr = stkclr;
  }
  
  sketch() {
    fill(this.clr);
    stroke(red(stkclr),green(stkclr),blue(stkclr));
    bounded = false;
    
    let coord = [render(this.a), render(this.b), render(this.c)];
    if (!bounded) {
      return;
    }
    triangle(coord[0][0], coord[0][1], coord[1][0], coord[1][1], coord[2][0], coord[2][1]);
  }
  
}

class Rect {
  constructor(a,b,c,d,clr,stkw,stkclr) {//a, b, c are xyz coords
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.clr = clr;
    this.stkw = stkw;
    this.stkclr = stkclr;
  }
  
  sketch() {
    fill(this.clr);
    stroke(red(this.stkclr),green(this.stkclr),blue(this.stkclr));
    bounded = false;
    
    let coord = [render(this.a), render(this.b), render(this.c), render(this.d)];
    
    if (!bounded) {
        return;
    }
    triangle(coord[0][0], coord[0][1], coord[1][0], coord[1][1], coord[2][0], coord[2][1]);
    triangle(coord[0][0],coord[0][1], coord[2][0], coord[2][1], coord[3][0], coord[3][1]);
  }
}

function render(p) {//doesn't work if the object is behind you though
  
  let op = [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
  let scl = (l(n)**2)/dp(op,n);
  op[0] *= scl;
  op[1] *= scl;
  op[2] *= scl;
  let ans = [sproj(op,xax) + w/2, sproj(op,yax) + h/2];
  //console.log(dp(op, n));
  if (sproj(op, n) <= 0) {
    //cout << dp(op,n) << endl;
    bounded = false;
  }
  
  if (ans[0] <= w || ans[0] >= 0 || ans[1] <= h || ans[1] >= 0) {
    bounded = true;
  }
  
  return ans;
}

class Cube {
  constructor(x1, y1, z1, x2, y2, z2, clr1, clr2, clr3, clr4, clr5, clr6) {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.clr1 = clr1;
    this.clr2 = clr2;
    this.clr3 = clr3;
    this.clr4 = clr4;
    this.clr5 = clr5;
    this.clr6 = clr6;
  }
  build() {
    let f1 = new Rect([this.x1,this.y1,this.z1], [this.x2,this.y1,this.z1], [this.x2,this.y2,this.z1],[this.x1,this.y2,this.z1],this.clr1,0,this.clr1);//front
  
  let f2 = new Rect([this.x1,this.y1,this.z1], [this.x2,this.y1,this.z3], [this.x2,this.y2,this.z3],[this.x1,this.y2,this.z3],this.clr2,0,this.clr2);//back
  
  let f3 = new Rect([this.x1,this.y1,this.z1],[this.x1,this.y2,this.z1],[this.x1,this.y2,this.z2],[this.x1,this.y1,this.z2],this.clr3,0,this.clr3);//left
  
  let f4 = new Rect([this.x2,this.y1,this.z1],[this.x2,this.y2,this.z1],[this.x2,this.y2,this.z2],[this.x2,this.y1,this.z2],this.clr4,0,this.clr4);//right
  
  let f5 = new Rect([this.x1,this.y1,this.z1],[this.x1,this.y1,this.z2],[this.x2,this.y1,this.z2],[this.x2,this.y1,this.z1],this.clr5,0,this.clr5);//top
  
  let f6 = new Rect([this.x1,this.y2,this.z1],[this.x1,this.y2,this.z2],[this.x2,this.y2,this.z2],[this.x2,this.y2,this.z1],this.clr6,0,this.clr6);//bottom
  
  f1.sketch();
  f2.sketch();
  f3.sketch();
  f4.sketch();
  f5.sketch();
  f6.sketch();
  }
  
}

class Tree {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.trunk = new Cube();
  }
  
  
}

let t = 0;
function draw() {
  background(225,245,245);
  
  let trunk = new Cube(50, 0, 310, 75, 200, 335, color(74,55,40,256), color(83,41,21,256), color(86,42,14,256), color(67,38,22,256), color(121,92,52,256), color(121,92,52,256));
  
  let leaf1 = new Cube(-50,200,210,175,250,435, color(56,124,68,256), color(56,124,68,256), color(0,128,0,256), color(0,128,0,256), color(37,100,23,256), color(37,65,23,256));
  
  let leaf2 = new Cube(-25,250,235,150,300,410, color(56,124,68,256), color(56,124,68,256), color(0,128,0,256), color(0,128,0,256), color(37,100,23,256), color(37,65,23,256));
  
  let leaf3 = new Cube(0,300,260,125,375,385, color(56,124,68,256), color(56,124,68,256), color(0,128,0,256), color(0,128,0,256), color(37,100,23,256), color(37,65,23,256));
  
  let sun = new Cube(0,900,300,100,925,400, color(225,225,0,255),color(225,225,0,255),color(225,225,0,255),color(225,225,0,255),color(225,225,0,255),color(255,255,0,255));
  

  
  motion();
  sun.build();
  leaf3.build();
  leaf2.build();
  leaf1.build();
  trunk.build();
  
}


function keyPressed() {
  
  if (key == 'w') {
    movf = true;
  }
  else if (key == 'a') {
    movl = true;
  }
  else if (key == 's') {
    movb = true;
  }
  else if (key == 'd') {
    movr = true;
  }
  else if (keyCode == 32) {
    movu = true;
  }
  else if (keyCode == SHIFT) {
    movd = true;
  }
  
  if (keyCode == LEFT_ARROW) {
    rotl = true;
  }
  else if (keyCode == RIGHT_ARROW) {
    rotr = true;
  }
  else if (keyCode == UP_ARROW) {
    rotu = true;
  }
  else if (keyCode == DOWN_ARROW) {
    rotd = true;
  }
}

function keyReleased() {
  if (key == 'w') {
    movf = false;
  }
  else if (key == 'a') {
    movl = false;
  }
  else if (key == 's') {
    movb = false;
  }
  else if (key == 'd') {
    movr = false;
  }
  else if (keyCode == 32) {
    movu = false;
  }
  else if (keyCode == SHIFT) {
    movd = false;
  }
  
  if (keyCode == LEFT_ARROW) {
    rotl = false;
  }
  else if (keyCode == RIGHT_ARROW) {
    rotr = false;
  }
  else if (keyCode == UP_ARROW) {
    rotu = false;
  }
  else if (keyCode == DOWN_ARROW) {
    rotd = false;
  }
}
