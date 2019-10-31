let x;
let y;

let xspeed;
let yspeed;

let img;
let r,g,b;
let p5Canvas = null;

function preload(){
	img = loadImage("./img/arrow-up.png")

}

function setup() {
	p5Canvas = createCanvas(600, 744);
	p5Canvas.parent("div-background");
	x = 200;
	y = 30;
	xspeed = 4;
	yspeed = 3;
	picColor();
}

function picColor(){
	r = random(100, 256);
	g = random(100, 256);
	b = random(100, 256);
}

function draw() {
	background('#1a1a22');
	//rect(x, y, 80, 60);
	image(img, x, y, 80, 80);
	tint(r,g,b);
	
	
	x = x + xspeed;
	y = y + yspeed;
	
	if(x + 70 >= width || x <= -10){
		xspeed *= -1; 
		picColor();
	}
	
	if(y + 70 >= height || y <= -10){
		yspeed *= -1; 
		picColor();
	}
}
