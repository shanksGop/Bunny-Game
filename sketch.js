const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;


let engine;
let world;
let ground;
let rope
var fruit_con
var melon, bunny, bunnyImg, bgImg
var button;
var blink, sad, eat
var fruit;
var bgSound, cutSound, sadSound, eatSound, airSound
var muteBtn
var balloon
var a = 0
var cartImg, cart
var edges
var Nx = -2
var x = 2

function preload(){
  melon = loadImage("assets/melon.png");
  bunnyImg = loadImage("assets/rabbit.png");
  bgImg = loadImage("assets/bg.png");
  blink = loadAnimation("assets/blink_1.png","assets/blink_2.png","assets/blink_3.png")
  sad = loadAnimation("assets/sad_1.png","assets/sad_2.png","assets/sad_3.png")
  eat = loadAnimation("assets/eat_0.png","assets/eat_1.png","assets/eat_2.png","assets/eat_3.png","assets/eat_4.png")
  cartImg = loadImage("cart.png")

  bgSound = loadSound("sound1.mp3")
  cutSound = loadSound("rope_cut.mp3")
  sadSound = loadSound("sad.wav")
  eatSound = loadSound("eating_sound.mp3")
  airSound = loadSound("air.wav")
 
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  
  eat.looping = false;
  sad.looping = false;
}


function setup() 
{
  createCanvas(500,700);
  frameRate(80)
  engine = Engine.create();
  world = engine.world;

  button = createImg("assets/cut_button.png");
  button.position(220,30)
  button.size(45,45);
  button.mouseClicked(drop)

  muteBtn = createImg("assets/mute.png")
  muteBtn.position(450,20)
  muteBtn.size(45,45)
  muteBtn.mouseClicked(mute)

  balloon = createImg("assets/balloon.png");
  balloon.position(10,250)
  balloon.size(150,100)
  balloon.mouseClicked(airBlow)


  ground = new Ground(200,690,600,20)
  rope = new Rope(7, {x:245,y:30});

  blink.frameDelay = 8 
  sad.frameDelay = 10
  eat.frameDelay = 20;

  bunny = createSprite(250,583,100,100)
  bunny.addImage(bunnyImg)
  bunny.scale = 0.2
  bunny.velocityX = x

  bunny.addAnimation("blinking",blink);
  bunny.addAnimation("eating",eat);
  bunny.addAnimation("crying",sad);
  bunny.changeAnimation("blinking")

  cart = createSprite(bunny.x +20,bunny.y + 60,50,50)
  cart.addImage(cartImg)
  cart.scale = 0.8
  cart.depth = bunny.depth +1
  cart.velocityX = x
  

  var fruitOptions = {density: 0.003, frictionAir: 0.0002}
  fruit = Bodies.circle(300,300,15,fruitOptions);
  Composite.add(rope.body,fruit);
  fruit_con = new Link(rope, fruit);

  //bgSound.play()
  //bgSound.setVolume(0.3)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)


}



function draw() 
{
  background(51);
  imageMode(CENTER);
  image(bgImg, width/2, height/2, 500, 700)
  Engine.update(engine);

  
  
  if(fruit!=null){
    var pos = fruit.position
    image(melon,pos.x,pos.y, 60,60)
  }

  ground.show();
  rope.show()

  if(collide(fruit,bunny) == true){
   bunny.changeAnimation("eating")
   eatSound.play()
   win();
   }
  if(fruit!=null&&fruit.position.y>=650){
    bunny.changeAnimation("crying")
    bgSound.stop()
    fruit = null
    sadSound.play()
    gameOver()
    
  }

  if(bunny.x > 500||cart.x > 500){
    bunny.velocityX = Nx
    cart.velocityX = Nx
  }

  if(bunny.x < 0||cart.x < 0){
    bunny.velocityX = x
    cart.velocityX = x
  }

  if(keyWentDown(32)){
    Nx-=1
    x+=1
  }

   drawSprites();

}
function drop(){
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutSound.play()

}
function collide(body,sprite){
  if(body!=null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y)
    if(d<=80){
      World.remove(world,fruit);
      fruit = null;
      return true;
    } else{
      return false;
    }
  }
}
function mute(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  } else{
    bgSound.play()
  }
}
function airBlow(){
  if(a === 0){
  balloon.size(150,70);
  balloon.position(10,270);
  a = 1
  }else if(a === 1){
  balloon.size(150,100);
  balloon.position(10,250);
  a = 0
  }
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.008,y:0});
  if(!airSound.isPlaying()){
  airSound.setVolume(0.2);
  airSound.play();;
  }
}
function gameOver(){
  swal({
    title: "Game Over!",
    text: "Thanks for Playing",
    imageUrl: "http://raw.githubusercontent.com/Sloggerman01/mellon/main/Broken_Melon-removebg-preview.png",
    imageSize: "150x150",
    confirmButtonText: "Play Again!"
  }, 
  function (isConfirm){
    if(isConfirm){
      location.reload();
    }
  }
  )
}


function win(){
  swal({
    title: "You Won!",
    text: "Thanks for Playing",
    imageUrl: "http://raw.githubusercontent.com/Sloggerman01/Bunny/main/blink_1.png",
    imageSize: "150x150",
    confirmButtonText: "Play Again!"
  }, 
  function (Confirm){
    if(Confirm){
      location.reload();
    }
  }
  )
}
