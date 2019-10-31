

let type = "webGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

PIXI.utils.sayHello(type)


PIXI.loader.add(["./img/arrow-up.png", 
                            "./img/foucs3.png",
                            "./img/stars.png"]).on("progress", loadProgressHandler).load(PIXIsetup);

let d = new Dust(PIXI);
let starts;
let starContainer;
let gameStart = false;
let gameStop = false;
let lv = 1, 
    lvText,
    lvTime = 0;
let loss = 0, 
    lossText;
let message;
let combo = 0, 
    comboText;
let arrow = new Array(13);
let arrowDegrees = new Array(arrow.length-1);
let foucsPanel;
let speed = 3;
let state;
let lvStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "#ae88d6",
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});
let messageStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 60,
    fill: "#ae88d6",
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});
let comboStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 30,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});


sounds.load([
    "./sound/gameMusic.mp3",
    "./sound/End_of_the_Rainbow.mp3"
]);
sounds.whenLoaded = soundSetup;

let soundVolume = 0.5;
let backgroundSound;
let gameSound;


function soundSetup(){
    gameSound = sounds["./sound/gameMusic.mp3"];
    backgroundSound = sounds["./sound/End_of_the_Rainbow.mp3"];
    gameSound.play();
    gameSound.loop = true;
    gameSound.volume = soundVolume;  
    gameSound.playFrom(0)
    gameSound.pan = 0;
    gameSound.pause();


      //Play the sound
    backgroundSound.play();
    //Make the sound loop
    backgroundSound.loop = true;

    //Set the volume 
    //1 is full volume, 2 is double volume, 0.5 is half volume, etc.
    backgroundSound.volume = soundVolume;  

    //Pause the sound. To resume paused sounds call `play` again
    //backgroundSound.pause();

    //Play from a specific time (in seconds)
    backgroundSound.playFrom(1)

    //Set the pan
    //-1 is the full left speaker, 0 is the middle, 1 is the full right
    //speaker
    backgroundSound.pan = 0;

    //Fade a sound out, over 3 seconds
    //backgroundSound.fadeOut(3);

    //Fade a sound in, over 2 seconds
    //backgroundSound.fadeIn(2)

    //Fade a sound to a volume level of `0.3` over 1 second
    //backgroundSound.fade(0.3, 1);

}


let app = new PIXI.Application({
    width: 600, 
    height: 744,
    transparent: true,
    antialias: true
});

document.getElementById("div-body-game").appendChild(app.view);


function PIXIsetup(){
    console.log("All files loaded");
    let rad = [0, 90, 180, 270]
    let anchorX = [0,0,1,1];
    let anchorY = [0,1,1,0];
    
    state =play;

    let positionY = -(300);
    starContainer = new PIXI.ParticleContainer(
        15000,
        {alpha: true, scale: true, rotation: true, uvs: true}
      );
    app.stage.addChild(starContainer);

    lvText = new PIXI.Text("LV 1", lvStyle);
    lvText.position.set(270, 0);
    app.stage.addChild(lvText);

    lossText = new PIXI.Text("", lvStyle);
    lossText.position.set(270, 710);
    app.stage.addChild(lossText);

    message = new PIXI.Text(" ", messageStyle);
    message.position.set(300, 300);
    app.stage.addChild(message);

    comboText = new PIXI.Text("", comboStyle);
    comboText.position.set(10, 470);
    app.stage.addChild(comboText);

    foucsPanel = new PIXI.Sprite(PIXI.loader.resources["./img/foucs3.png"].texture);
    foucsPanel.width = 600;
    foucsPanel.height = 100;
    foucsPanel.x = 0;
    foucsPanel.y = 525;
    foucsPanel.vx = 0;
    foucsPanel.vy = 0;
    app.stage.addChild(foucsPanel);

    for (let i = 0; i < arrow.length; i++) {
        let degrees = randomInt(0,3);
        let positionX = randomInt(0, 600-64);
        positionY -= randomInt(64, 200);
        arrow[i] = new PIXI.Sprite(PIXI.loader.resources["./img/arrow-up.png"].texture);
        arrowDegrees[i] = degrees;
        //position
        arrow[i].x = positionX;
        arrow[i].y = positionY;
    
        //size
        arrow[i].width = 64;
        arrow[i].height = 64;

        /*
        rotation by radians,  e.g. 1~=57.2958
                                                1.57~=90        so : 0=0, 1.57=90, 3.14=180, 4.71=270
        */
       arrow[i].rotation = radians(rad[degrees]); 
    
        //以圓心偏移
        arrow[i].anchor.x = anchorX[degrees];  //00,01,11,10
        arrow[i].anchor.y = anchorY[degrees];
    
        app.stage.addChild(arrow[i]);
    }
    //app.ticker.add(delta => gameLoop(delta));
    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown"),
        space = keyboard(" ");
    
    //Up
    up.press = () => {
        if (!down.isDown && !right.isDown && !left.isDown) {
            if(arrowInPanel("up")){
                //pass
            }
        }
    };
    up.release = () => {
        if (!down.isDown && !right.isDown && !left.isDown) {
            //pass
        }
    };

    //Down
    down.press = () => {
        if (!up.isDown && !right.isDown && !left.isDown) {
            if(arrowInPanel("down")){
                //pass
            }
        }
    };
    down.release = () => {
        if (!up.isDown && !right.isDown && !left.isDown) {
            //do nothing
        }
    };

    //Right
    right.press = () => {
        if (!left.isDown && !up.isDown && !down.isDown) {
            if(arrowInPanel("right")){
                //pass
            }
        }
    };
    right.release = () => {
        if (!left.isDown && !up.isDown && !down.isDown) {
            //pass
        }
    };

    //Left
    left.press = () => {
        if(!up.isDown && !down.isDown && !right.isDown){
            if(arrowInPanel("left")){
                //pass
            }
        }
    };/*
    left.release = () => {
        if(!up.isDown && !down.isDown && !right.isDown){
            //pass
        }
    };*/

    //Space
    space.press = () => {
        stopGame();
    };
    space.release = () => {
        //pass
    };
}


function stopGame(){
    console.log("Stop game. " + gameStop);
    if(gameStop){
        message.text = "";
    }else{
        message.text = "Pause.";
    }
    gameStop = !gameStop;
}


function gameLoop(delta){
    state(delta);
}


function arrowInPanel(key){
    let degrees = null;
    if(key == "up"){
        degrees = 0;
    }else if(key == "right"){
        degrees = 1;
    }else if(key == "down"){
        degrees = 2;
    }else if(key == "left"){
        degrees = 3;
    }
    for (let i = 0; i < arrow.length; i++) {
        if(arrow[i].y > 525-63 && arrow[i].y < 625 && arrowDegrees[i] === degrees && !gameStop && arrow[i].visible){
            arrow[i].visible = false;
            stars = d.create(
                arrow[i].x + 32,                                       //x start position
                arrow[i].y + 32,                                       //y start position
                () => new PIXI.Sprite(                     //Sprite function
                  PIXI.utils.TextureCache["./img/stars.png"]
                ), 
                starContainer,                                     //Container for particles
                50                                         //Number of particles
              );
            return true;
            break;
        }
    }
    return false;
}


function firtimeMessage(){
    let counDownText = ["Ready!", "Go!!!", ""];
    for (let i = 0; i < counDownText.length; i++) {
        setTimeout(function(){
            console.log(counDownText[i]);
            message.text = counDownText[i];
            if(i == counDownText.length -1)return true;
        },i*1000);
    }
}


function gameOver(){
    gameStop = true;
    message.x = 120;
    for (let i = 0; i < arrow.length; i++) {
        arrow[i].visible = false;
    }
    message.text = "GAME OVER";
}

function reset(){
    gameSoundNo = 0;
    gameStart = false;
    gameStop = false;
    lv = 1;
    lvText.text = "LV 1";
    lvTime = 0;
    loss = 0;
    lossText.text = "";
    message.x = 300;
    message.text = "";
    combo = 0; 
    comboText.text = "";
    speed = 3;
    let positionY = -(300);
    for (let i = 0; i < arrow.length; i++) {
        arrow[i].visible = true;
        positionY -= randomInt(64, 200);
        arrow[i].y = positionY;
    }
    firtimeMessage();
}


function play(delta){
    requestAnimationFrame(gameLoop); 
    d.update();
    let positionY = arrow[arrow.length - 1].y - 64;
    if(!gameStop){
        if(!gameSound.playing){
            gameSound.play();
        }
        for (let i = 0; i < arrow.length; i++) {
            let positionX = randomInt(0, 600-64);
            arrow[i].vy = speed;
            arrow[i].y += arrow[i].vy;
        
            if(arrow[i].y >= 744+64){
                if(!arrow[i].visible){
                    lvTime++;
                    combo++;
                    arrow[i].visible = true;
                }else{
                    loss++;
                    combo = 0;
                    comboText.text = "";
                }
                if(combo>=5){
                    comboText.text = "Combo " + combo;
                }
                arrow[i].x = positionX;
                if(i == 0){
                    arrow[i].y = positionY;
                }else{
                    arrow[i].y = arrow[i-1].y - randomInt(64, 200);
                }
            }
        }
        if(lvTime >= lv*10){
            lvTime = 0;
            lv++;
            lvText.text = "LV " + lv;
            speed += 0.35;
        }
        lossText.text = "Loss " + loss + "/" + lv*5 + "";
        if(loss > lv*5)gameOver();
    }else{
        gameSound.pause();
    }
}

function loadProgressHandler(loader, resource) {

    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url); 
    
    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%"); 
    
    //If you gave your files names as the first argument 
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
}


function radians(degrees){
    let radians = (2*3.14)*(degrees/360);
    return radians;
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        console.log(event.key);
        if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}