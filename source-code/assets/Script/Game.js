cc.Class({
    extends: cc.Component,

    properties: {
        //方块角色
        playerPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 碰撞后溅射的小方块
        bongPrefab:{
            default:null,
            type: cc.Prefab
        },
        // 关卡进度显示
        levelPrefab:{
            default:null,
            type: cc.Prefab
        },
        // 返回菜单按钮
        toMenuPrefab:{
            default:null,
            type: cc.Prefab
        },
        //方块移动方向
        direction:1,
        //方块在该场景中所在的层数
        level:1,
        //游戏现在所在的关卡数
        gameLevel:1,
    },
    onLoad: function () {
        // 打开碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        
        // 得到当前的关卡数
        var levelCur = cc.director.getScene().children[0].name;
        this.gameLevel = parseInt(levelCur.replace("Level",""));
        
        var self = this;
        //取得背景容器
        var bgcontainer = this.node.getChildByName("bgcontainer");
        this.bg1 = bgcontainer.getChildByName("bg1");
        this.bg2 = bgcontainer.getChildByName("bg2");
        this.bg3 = bgcontainer.getChildByName("bg3");

        //创建cube
        this.createPlayer(-this.node.width/2, this.node.height/6+20);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;
        
        // 第6关之后方块移动加速
        if(this.gameLevel >= 6 ){
            this.player.getComponent('Player').moveDuration = 2.5;
        }
        
        // 位于菜单场景中特定的快速移动
        if(levelCur == "Menu"){
            this.gameLevel = 0;
            this.player.getComponent('Player').moveDuration = 1;
        }
        // 方块移动
        this.movePlayer(this.direction);
        
        if(this.gameLevel>0){
            // 显示关卡进度
            var levelPrefab = cc.instantiate(this.levelPrefab);
            this.node.addChild(levelPrefab);
            levelPrefab.setPosition(cc.p(0,290));
            levelPrefab.color = this.bg2.color;
            levelPrefab.getComponent(cc.Label).string = this.gameLevel + "/10";
            //显示返回菜单
            var toMenuPrefab = cc.instantiate(this.toMenuPrefab);
            this.node.addChild(toMenuPrefab);
            toMenuPrefab.setPosition(cc.p(420,290));
            toMenuPrefab.color = this.bg2.color;
        }else{
            // 菜单场景中动画显示about按钮
            var about = this.node.getChildByName("about");
            setTimeout(function(){
                about.runAction(cc.moveBy(0.3,cc.p(0,-71)).easing(cc.easeCubicActionOut()));
            },1000);
            // 菜单场景中动画显示exit按钮
            var exit = this.node.getChildByName("exit");
            setTimeout(function(){
                exit.runAction(cc.moveBy(0.3,cc.p(0,71)).easing(cc.easeCubicActionOut()));
            },2000);
        }
        
        //设置小方块初始颜色
        this.player.color = this.bg2.color;
        
        // 监听方块成功走完一层的事件
        this.node.on("moveEnd",function(){
            self.level++;
            if(self.level > 3){
                self.gameOver();
            }else{
               self.direction = -self.direction;
               self.restart(self.level); 
            }
        });
        // 监听方块碰撞事件
        this.node.on("collision",function(e){
            var x = e.target.x;
            var y = e.target.y;
            self.toBong(x, y);
            self.restart(self.level);
        });
        //监听屏幕触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,function(){
            self.touch();
        });
    },
    // 屏幕触摸时小方块跳跃
    touch: function(){
        if(this.gameLevel > 0){
            this.player.getComponent('Player').jump();
        }
    },
    // 移动方块函数
    movePlayer:function(direction){
        this.player.getComponent('Player').goMove(direction);
    },
    //创建方块角色函数
    createPlayer:function(x,y){
        this.player = cc.instantiate(this.playerPrefab);
        this.node.addChild(this.player);
        this.player.setPosition(cc.p(x,y));
    },
    // 创建碰撞碎片函数
    createBong:function(x,y){
        var bong = cc.instantiate(this.bongPrefab);
        this.node.addChild(bong);
        bong.setPosition(cc.p(x,y));
        this.bongDestroy(bong);
        bong.color = this.player.color;
        return bong;
    },
    // 碰撞产生碎片
    toBong:function(x,y){
        var n = parseInt(Math.random()*10+5);
        for(var i = 0; i < n; i++){
            var length = Math.random()*150+80;
            var deg = Math.random()*360;
            var vx = length*Math.cos(deg);
            var vy = length*Math.sin(deg);
            var move = cc.moveBy(1,cc.p(vx,-vy)).easing(cc.easeCubicActionOut());
            var scale = cc.scaleBy(1, 0.2, 0.2);
            this.createBong(x, y).runAction(move);
        }
    },
    // 销毁碰撞碎片
    bongDestroy:function(bong){
        var time = Math.random()*300+bong.getComponent('bong').endTime*1000;
        setTimeout(function(){bong.destroy();},time);
    },
    // 重新开始该层
    restart:function(level){
        this.player.destroy();
        this.createPlayer(-(this.direction*this.node.width/2+this.player.width/2),this.node.height/2-level*this.node.height/3+20);
        this.player.getComponent('Player').mediaWidth = this.node.width;
        this.player.getComponent('Player').mediaHeight = this.node.height;
        if(this.gameLevel >= 6){
            this.player.getComponent('Player').moveDuration = 2.5;
        }
        if(this.gameLevel === 0){
            this.player.getComponent('Player').moveDuration = 1;
        }
        this.movePlayer(this.direction);
        if(level == 1 || level == 3){
            //设置小方块颜色
            this.player.color = this.bg2.color;
        }
        if(level == 2){
            //设置小方块颜色
            this.player.color = this.bg3.color;
        }
    },
    gameOver:function(){
        // 进入下一关卡
        if(this.gameLevel !== 0){
            this.gameLevel++;
            cc.director.loadScene('Level'+this.gameLevel);
        }else{
            this.player.destroy();
        }
        // 通过最后一关后返回菜单
        if(this.gameLevel == 10){
            cc.director.loadScene("Menu");
        }
    },

});
