
'use strict'

const { ipcRenderer } = require('electron'); //> ipc for renderer process
const startMenu = document.getElementById("div-body-startMenu");
const startMenuMiddle = document.getElementById("div-startMenu-middle");
const startMenuLoad = document.getElementById("div-startMenu-middle-load");
const game = document.getElementById("div-body-game");
const optionMenu = document.getElementById("div-body-optionMenu");
const aboutPage = document.getElementById('about-window');
const bottomLeft = document.getElementById("div-footer-left");
const clickStartButton = document.getElementById("click-start");
const clickOptionButton = document.getElementById("click-option");
const clickAboutButton = document.getElementById("click-about");
const clickAboutButtonClose = document.getElementById("click-about-close");
const clickExitButton = document.getElementById("click-exit");
const clickBackButton = document.getElementById("click-back");
const clickResetButton = document.getElementById("click-reset");
const soundBar = document.getElementById("sound-control");
let firstToGame = 0;

function closeLoad(){
    startMenuLoad.style.display = "none";
    startMenuMiddle.style.display = "block";
}

function toGame(){
    startMenu.style.display = "none";
    game.style.display = "block";
    optionMenu.style.display = "none";
    bottomLeft.style.display = "block";
    clickResetButton.style.visibility = "visible";
    backgroundSound.pause();
    if(firstToGame == 0){
        gameStart = true;
        gameLoop();
        firtimeMessage();
        firstToGame++;
    }
}


function toOptionMenu(){
    startMenu.style.display = "none";
    game.style.display = "none";
    optionMenu.style.display = "block";
    bottomLeft.style.display = "block";
}


function toStartMenu(){
    startMenu.style.display = "block";
    game.style.display = "none";
    optionMenu.style.display = "none";
    bottomLeft.style.display = "none";
    clickResetButton.style.visibility = "hidden";

    if(gameStart){
        gameStop = true;
        message.text = "Pause.";
        if(!backgroundSound.playing){
            backgroundSound.play();
        }
    }
}


function toAbout(){
    aboutPage.style.display='block'
}


function aboutClose(){
    aboutPage.style.display='none';
}

function soundControl(){
    soundVolume = soundBar.value/100;
    gameSound.volume = soundVolume;  
    gameSound.pause();

    backgroundSound.volume = soundVolume; 
}


window.onclick = function(event) {
    if (event.target == aboutPage) {
        aboutPage.style.display = "none";
    }
}


function quit(){
    //> close button
    clickExitButton.addEventListener('click', function(){
        //> send a message to close-main-window channel without args
        ipcRenderer.send('quit-main');
    });
}

function ready(){
    clickStartButton.onclick = toGame;
    clickOptionButton.onclick = toOptionMenu;
    clickBackButton.onclick = toStartMenu;
    clickAboutButton.onclick = toAbout;
    clickAboutButtonClose.onclick = aboutClose;
    clickResetButton.onclick = reset;
    soundBar.oninput = soundControl;
    quit();
    window.setTimeout(closeLoad, 10000);
}

window.addEventListener('load', ready);



