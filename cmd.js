var lib = require('./lib');

var t_board = {
    a:{
        '1':null,
        '2':null,
        '3':null
    },
    b:{
        '1':null,
        '2':null,
        '3':null
    },
    c:{
        '1':null,
        '2':null,
        '3':null
    }
}




var fish_tank = new lib.FishTank({
    inputs:{
        a1:function(){
            return t_board.a[1];
        },
        a2:function(){
            return t_board.a[2];
        },
        a3:function(){
            return t_board.a[3];
        },
        b1:function(){
            return t_board.b[1];
        },
        b2:function(){
            return t_board.b[2];
        },
        b3:function(){
            return t_board.b[3];
        },
        c1:function(){
            return t_board.c[1];
        },
        c2:function(){
            return t_board.c[2];
        },
        c3:function(){
            return t_board.c[3];
        }
    },
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
        },
        a2:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.a[2]){
                return false;
            }
            t_board.a[2] = this.id;
            this.has_moved = true;
            return true;
        },
        a3:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.a[3]){
                return false;
            }
            t_board.a[3] = this.id;
            this.has_moved = true;
            return true;
        },
        b1:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.b[1]){
                return false;
            }
            t_board.b[1] = this.id;
            this.has_moved = true;
            return true;
        },
        b2:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.b[2]){
                return false;
            }
            t_board.b[2] = this.id;
            this.has_moved = true;
            return true;
        },
        b3:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.b[3]){
                return false;
            }
            t_board.b[3] = this.id;
            this.has_moved = true;
            return true;
        },
        c1:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.c[1]){
                return false;
            }
            t_board.c[1] = this.id;
            this.has_moved = true;
            return true;
        },
        c2:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.c[2]){
                return false;
            }
            t_board.c[2] = this.id;
            this.has_moved = true;
            return true;
        },
        c3:function(){
            if(this.has_moved){
                return false;
            }
            if(t_board.c[3]){
                return false;
            }
            t_board.c[3] = this.id;
            this.has_moved = true;
            return true;
        }
    },
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
            if(row >= 3 || col[ii] >= 3){
                fish.score += 10;
                return next();
            }
        }

		return next();
    },
    /**
     * Gets run once per tick
     */
    on_tick:function(next){
        console.log(' --------------------------------  ');
        var move_ct = 0;
        for(var i in t_board){
            var line = '';
            for(var ii in t_board[i]){
                if(t_board[i][ii]){
                    move_ct += 1;
                    line += ' ' +  t_board[i][ii];
                }else{
                    line += '       ';
                }

            }
            console.log(line);
        }
        for(var i in fish_tank.fish_coll){
            fish_tank.fish_coll[i].has_moved = false;
            console.log('Fish: ' + fish_tank.fish_coll[i].id + ' - Score: ' + fish_tank.fish_coll[i].score);
            if(fish_tank.fish_coll[i].score != 0){
                console.log("!!!!!!!!!!!!!!!!!!!!!!! - " + fish_tank.fish_coll[i].id + " - WINNER!!!!!!!!!!!!!!!!!!!!!!!");
				var ranked = fish_tank.rank();
				//There should only be 2
				ranked[1].kill();
				ranked[0].spawnChild();
               return next(/*true*/);
            }

        }
        console.log('Move CT:' + move_ct);
        if(move_ct >= 9){
            return next(true);
        }
        return next();
    }

});
fish_tank.run(function(){
    console.log("DONE!!")
});