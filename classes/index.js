class sprite 
  {
      constructor({position,imageSrc,frameRate=1,frameBuffer=3,scale=1})
      {
        this.frameRate=frameRate;
          this.position=position;
          this.scale=scale;
          this.loaded=false;
          this.image=new Image();
          this.image.onload = () =>
            {
                this.height=this.image.height*this.scale;
                this.width=(this.image.width/this.frameRate)*this.scale;
                this.loaded=true;
            }
          this.image.src=imageSrc;
          this.currentFrame=0;
          this.frameBuffer=frameBuffer;
          this.elapsedFrame=0;

      }
      draw() {
        const cropbox = {
            position: {
                x:this.currentFrame*(this.image.width/this.frameRate
                ),
                y:0,
            },
            width:this.image.width / this.frameRate,
            height:this.image.height
        }
          c.drawImage (
            this.image,cropbox.position.x,cropbox.position.y,cropbox.width,cropbox.height, this.position.x,this.position.y,this.width,this.height)
               
            
    }
  
      update()
      {
         this.draw();
         this.updateFrame();

      }
      updateFrame()
      {
       
        this.elapsedFrame++;
        if(this.elapsedFrame%this.frameBuffer===0)
            {
                if(this.currentFrame<this.frameRate-1)
                    {
                       this.currentFrame++;
                    }
                else{
                    this.currentFrame=0;
                }
            }
       
      }
  }
  




















  class player extends sprite
  {
  constructor({position,collisionBlock,plateformCollisionsBlocks,imageSrc,frameRate,scale=0.5,animations})
  {
      super({ imageSrc ,frameRate,scale}); // Call the constructor of the base class
        
      this.position=position
      this.velocity={
          x:0, 
          y:1,
      }
      
      this.collisionBlock=collisionBlock
      this.plateformCollisionsBlocks=plateformCollisionsBlocks
      this.animations = animations
      this.lastDirection='right'
     for(let key in this.animations)
        {
            const image = new Image();
            image.src=this.animations[key].imageSrc;
            this.animations[key].image=image; 
        }
        this.hitbox= {
            position:{
                x:this.position.x+35,
                y:this.position.y+26,
            },
            height: 27,
            width: 14,
    
          }
        this.cameraBox= {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            width:200,
            height:80,
        }
  }

  switchSprite(key)
  {
    if(this.image===this.animations[key].image || !this.loaded)
        return
    this.currentFrame=0;
    this.image=this.animations[key].image;
    this.frameBuffer=this.animations[key].frameBuffer;
    this.frameRate=this.animations[key].frameRate;
   
}
updateCameraBox()
{
    this.cameraBox= {
        position: {
            x:this.position.x- 50,
            y:this.position.y
        },
        width:200,
        height:80,
    }
}

checkForHorizontalCanvasCollisions()
{
    if(this.hitbox.position.x+ this.hitbox.width + this.velocity.x>=576 ||
        this.hitbox.position.x+this.velocity.x <=0
    )
        {
            this.velocity.x=0;
        }
}

shouldPanCameraToTheLeft({canvas,camera})
{
    const cameraBoxRightSide= this.cameraBox.position.x+this.cameraBox.width
    if(cameraBoxRightSide>=576) return
    
    if(cameraBoxRightSide>=(canvas.width/4)+ Math.abs(camera.position.x))
        {
            camera.position.x-=this.velocity.x;
        }
}


shouldPanCameraToTheRight({canvas,camera})
{
    if(this.cameraBox.position.x<=0)
        return
    if(this.cameraBox.position.x<=Math.abs(camera.position.x))
        {
            camera.position.x-=this.velocity.x
        }
    
}


shouldPanCameraToTheDown({canvas,camera})
{
    if(this.cameraBox.position.y + this.velocity.y<=0)
       return
    if(this.cameraBox.position.y<=Math.abs(camera.position.y))
        {
            camera.position.y-=this.velocity.y
        }
    
}

shouldPanCameraToTheUp({canvas,camera})
{
    if(this.cameraBox.position.y +this.cameraBox.height + this.velocity.y>=432)
       return
    if(this.cameraBox.position.y + this.cameraBox.height>=Math.abs(camera.position.y) + (canvas.height/4))
        {
            camera.position.y-=this.velocity.y
        }
    
}
  update()
  {
   this.updateFrame();
   this.updateHitbox();
   this.updateCameraBox();
//    c.fillStyle='rgba(0,255,0,0.2)';
//     c.fillRect(this.position.x,this.position.y,this.width,this.height)
//     //updateHitbox

    // c.fillStyle='rgba(0,0,255,0.2)';
    // c.fillRect(this.cameraBox.position.x,this.cameraBox.position.y,this.cameraBox.width,this.cameraBox.height)

      super.draw();
      this.position.x +=this.velocity.x;
      this.updateHitbox();
      this.checkForHorizontalCollisions();
      this.applyGravity();
      this.updateHitbox();
      this.checkForVertialCollisions();
  }
  updateHitbox()
  {
    this.hitbox= {
        position:{
            x:this.position.x+35,
            y:this.position.y+26,
        },
        height: 27,
        width: 14,

      }

  }
  checkForHorizontalCollisions()
  {
                
   for(let i=0;i<this.collisionBlock.length;i++)
      {
          const collision_Block=this.collisionBlock[i];
          if(collision({
              object1:this.hitbox,
              object2:collision_Block,
          }))
              {
                  if(this.velocity.x>0)
                      {
                          this.velocity.x=0;
                          const offset=this.hitbox.position.x-this.position.x+this.hitbox.width;
                     
                          this.position.x=collision_Block.position.x-this.width-offset-0.01;
                      }
                      
               
              if(this.velocity.x<0)
                  {
                      this.velocity.x=0;
                      const offset=this.hitbox.position.x-this.position.x;
                      this.position.x=collision_Block.position.x+collision_Block.width-offset-0.01;
                  }
              }
                
       }
  
      }
  applyGravity()
  {
    this.velocity.y+=gravity
    this.position.y +=this.velocity.y;
   
  }
  checkForVertialCollisions()
  {
     
   for(let i=0;i<this.collisionBlock.length;i++)
      {
          const collision_Block=this.collisionBlock[i];
          if(collision({
              object1:this.hitbox,
              object2:collision_Block,
          }))
              {
                 if(this.velocity.y>0)
                      {
                          this.velocity.y=0;
                          const offset=this.hitbox.position.y-this.position.y+this.hitbox.height;
                          this.position.y=collision_Block.position.y-offset-0.01;
                      }
               
              if(this.velocity.y<0)
                  {
                      this.velocity.y=0;
                      const offset=this.hitbox.position.y-this.position.y;

                      this.position.y=collision_Block.position.y+collision_Block.height-offset+ 0.01;
                  }
              }
      }
      //plateform collision
      for(let i=0;i<this.plateformCollisionsBlocks.length;i++)
        {
            const plateform_collision_block=this.plateformCollisionsBlocks[i];
            if(plateformCollision({
                object1:this.hitbox,
                object2:plateform_collision_block,
            }))
                {
                   if(this.velocity.y>0)
                        {
                            this.velocity.y=0;
                            const offset=this.hitbox.position.y-this.position.y+this.hitbox.height;
                            this.position.y=plateform_collision_block.position.y-offset-0.01;
                        }
                 
              
        }
    
        }
  
      }
    }














































  
  
  
  
  
  const canvas=document.querySelector('canvas');
    const c=canvas.getContext('2d')
    canvas.width=1024;
    canvas.height=576;
    c.fillStyle='white';
    c.fillRect('0','0',canvas.width,canvas.height)
    const gravity=0.1;
    const scaledCanvas ={
        width: canvas.width/4,
        height: canvas.height/4,
    }
    const collisionBlock=[]
    const floorCollisions2D=[]
    for(let i=0;i< floorCollisions.length;i +=36)
        {
            floorCollisions2D.push(floorCollisions.slice(i,i+36));
            
        }
        floorCollisions2D.forEach((row,y)=>
            {
                row.forEach((Symbol,x)=>
                    {
                        if(Symbol===202)
                            {
                                   collisionBlock.push(
                                        new collisionblock({
                                            position: {
                                                x:x*16,
                                                y:y*16,
                                            }
                                        })
                                    )
                            }
                    })

            })

            const plateformCollisions2D=[]
    for(let i=0;i < platformCollisions.length; i +=36)
        {
            plateformCollisions2D.push( platformCollisions.slice(i,i+36));
           
        }
        let plateformCollisionsBlocks =[]
        plateformCollisions2D.forEach((row,y)=>
            {
                row.forEach((Symbol,x)=>
                    {
                        if(Symbol===202)
                            {
                                plateformCollisionsBlocks.push(
                                        new collisionblock({
                                            position: {
                                                x:x*16,
                                                y:y*16,
                                            },
                                            height:4
                                        })
                                    )
                            }
                    })

            })
        const player1=new player(
            {
                position:
                {
                x:100,
                y:300,
                },
                collisionBlock,
                plateformCollisionsBlocks: plateformCollisionsBlocks,
                imageSrc: './warrior/Idle.png',
                frameRate: 8,
                animations:
                {
                    Idle:
                    {
                        imageSrc:'./warrior/Idle.png',
                        frameRate: 8,
                        frameBuffer: 3,
                    },
                    Run:
                    {
                        imageSrc:'./warrior/Run.png',
                        frameRate: 8,
                        frameBuffer: 5,
                    },
                    Jump:
                    {
                        imageSrc:'./warrior/Jump.png',
                        frameRate: 2,
                        frameBuffer: 3,
                    },
                    Fall:
                    {
                        imageSrc:'./warrior/Fall.png',
                        frameRate: 2,
                        frameBuffer: 3,
                    },
                    Fall:
                    {
                        imageSrc:'./warrior/Fall.png',
                        frameRate: 2,
                        frameBuffer: 3,
                    },
                    FallLeft:
                    {
                        imageSrc:'./warrior/FallLeft.png',
                        frameRate: 2,
                        frameBuffer: 3,
                    },
                    RunLeft:
                    {
                        imageSrc:'./warrior/RunLeft.png',
                        frameRate: 8,
                        frameBuffer: 5,
                    },
                    IdleLeft:
                    {
                        imageSrc:'./warrior/IdleLeft.png',
                        frameRate: 8,
                        frameBuffer: 5,
                    },
                    JumpLeft:
                    {
                        imageSrc:'./warrior/JumpLeft.png',
                        frameRate: 2,
                        frameBuffer: 3,
                    },
                    

                }
                
            } 
          );
  const keys={
    d:
    {
        pressed:false,
    },
    a:
    {
        pressed:false,
    }
  }

  const background=new sprite(
    {
        position:{
            x:0,
            y:0,
        },
        imageSrc: './background.png',
    }
  )

  const camera= {
    position:
    {
        x:0,
        y:-432+scaledCanvas.height
    },
  }


    function animate()
    { 
        window.requestAnimationFrame(animate);
        c.fillStyle='white';
        c.fillRect('0','0',canvas.width,canvas.height)
         c.save()
         c.scale(4,4)
         c.translate(camera.position.x,camera.position.y)
        background.update();
    //     collisionBlock.forEach((collisionblock)=>{
    //         collisionblock.update();
    //     })
         
    //    plateformCollisionsBlocks.forEach((block)=>{
    //         block.update();
    //     })
       // player1.checkForHorizontalCanvasCollisions()
       player1.checkForHorizontalCanvasCollisions()
        player1.update();
        player1.velocity.x=0;
        if(keys.d.pressed) 
            {
                player1.switchSprite('Run')
                player1.velocity.x=2;
                player1.lastDirection='right';
                player1.shouldPanCameraToTheLeft({canvas,camera})
            }

            else if(keys.a.pressed)
                {
                    player1.switchSprite('RunLeft');
                    player1.velocity.x=-2;
                    player1.lastDirection='left';
                    player1.shouldPanCameraToTheRight({canvas,camera})
                }
               
                else if(player1.velocity.y===0)
                    {
                       
                        if(player1.lastDirection==='right')
                            {
                                player1.switchSprite('Idle');
                            }
                            else if(player1.lastDirection==='left')
                                {
                                    player1.switchSprite('IdleLeft');
                                }
                
                    }

                    if(player1.velocity.y<0)
                        {
                            player1.shouldPanCameraToTheDown({canvas,camera});
                            if(player1.lastDirection==='right')
                                {
                                    player1.switchSprite('Jump')
                                }
                                else
                                {
                                    player1.switchSprite('JumpLeft');
                                }
                            
                        }

                        else if (player1.velocity.y>0)
                            {
                                player1.shouldPanCameraToTheUp({canvas,camera});
                                if(player1.lastDirection==='right')
                                    {
                                        player1.switchSprite('Fall');
                       
                                    }
                               else
                               {
                                player1.switchSprite('FallLeft');
                               }
                            }
                    c.restore()
    }
   
    animate()

window.addEventListener('keyup',(event)=>
    {
        switch(event.key)
        {
            case 'd':
                keys.d.pressed=false;
              player1.velocity.x=1;
            break
            case 'a':
            keys.a.pressed=false;
            player1.velocity.x=-1;
            break
           
          }

    })

    window.addEventListener('keydown',(event)=>
        {
            switch(event.key)
            {
                case 'd':
                    keys.d.pressed=true;
                  player1.velocity.x=1;
                break
                case 'a':
                keys.a.pressed=true;
                player1.velocity.x=-1;
                break
                case 'w':
                    player1.velocity.y=-4;
                  break
              }
    
        })






