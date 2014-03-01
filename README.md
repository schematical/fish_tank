fish_tank
=========
This is the begining of my genetic learning algorithm in Node. I built it at a hackathon for fun but plan to add more to it.

For a quick intro to what I was trying to acomplish check out [This Youtube Video](https://www.youtube.com/watch?v=GvEywP8t12I). 

I started out with tick tack toe instead. There is still a lot to go. Eventually I have an idea for a fully functional game 2d top view simulation game. Connect with me if you have any interest in building a much larger game.

If you want to run it just clone it and run`node cmd.js`. It should generate and battle two or more 'Fish'. Feel free to play with the settings.

##Configuring
Basically you write the game first then pass in the **inputs** and **outputs**
` var fish_tank = new lib.FishTank({ ...}); `

The options you pass in expect a couple of things:
###Inputs:
An object that contains a number of functions that will return a value that will be used by the **Fish** to make a decision.
```
var fish_tank = new lib.FishTank({
    inputs:{
        a1:function(){
            return t_board.a[1];
        },
        
    },
    ... 
```

###Outputs:
Out puts is an object where each property is a function and one of the possible moves it can make. Return `false` if that move is not possible.

```
var fish_tank = new lib.FishTank({
    outputs:{
        a1:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.a[1]){
                return false;
            }
            t_board.a[1] = this.id;
            this.has_moved = true;
            return true;
        },... 
```
        
        
###Score:
This gets run once per **Tick**, bacsically once per decision cycle, to determine what **Fish** is doing the best.
```
var fish_tank = new lib.FishTank({
    score:function(fish, next){
        var col = {};
        for(var i in t_board){

            var row = 0;
            for(var ii in t_board[i]){
                if(!col[ii]){
                    col[ii] = 0;
                }
                if(t_board[i][ii] == fish.id){
                    col[ii] += 1;
                    row += 1;
                }
            }
            if(row >= 3 || col[i] >= 3){
                fish.score += 10;
                next();
            }
        }

        next();
    },...
```

###On Tick:
The `on_tick` function runs once per decision cycle and basically does clean up or updates any display you might have.


```
var fish_tank = new lib.FishTank({
    on_tick:function(next){
        console.log(' --------------------------------  ');
        var move_ct = 0;
        /*
            Print out what is going on or update graphics...
        */
        return next();
    },..
```

});
