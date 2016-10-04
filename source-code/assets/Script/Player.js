cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight:0,
        jumpDuration: 0.35,
        moveDuration:3.4,
        allowJump:true,
        originY:0,
        mediaWidth:0,
        mediadHeight:0,
        pointPrefab:{
            default:null,
            type: cc.Prefab
        },
        starAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad: function () {
        this.jumpAction = this.setJumpAction();
        this.setInputControl();
    },
    jump:function(){
        if(this.allowJump){
            this.node.runAction(this.jumpAction);
        }
    },
    goMove:function(direction){
        this.moveAction = this.setMoveAction(direction);
        this.node.runAction(this.moveAction);
    },
    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var jumpRotate = cc.rotateBy(this.jumpDuration*2, 180, 180);
        var callback = cc.callFunc(function(){
            this.allowJump = true;
        }, this);
        var forbidJump = cc.callFunc(function(){
            this.allowJump = false;
        }, this);

        return cc.spawn(jumpRotate,(cc.sequence(forbidJump,jumpUp, jumpDown, callback)));
    },
    // 设置移动动画
    setMoveAction: function(direction){
        var moveToRight = cc.moveBy(this.moveDuration,cc.p((this.mediaWidth+this.node.width)*direction,0));
        var moveEnd = cc.callFunc(function(){
            this.node.dispatchEvent( new cc.Event.EventCustom('moveEnd', true) );
        }, this);
        return cc.sequence(moveToRight,moveEnd);
    },
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.space:
                        self.jump();
                        break;
                }
            }
        }, self.node);
    },
    // 监听方块碰撞
    onCollisionEnter: function (other, self) {
        if(other.node.name == "barrier"){
            // 碰撞障碍
            this.node.dispatchEvent( new cc.Event.EventCustom('collision', true) );
        }else{
            // 接触到point或者星星
            this.pointGain(other.node);
            cc.audioEngine.playEffect(this.starAudio, false);
        }
    },
    //接触到point或者星星
    pointGain: function(point){
        var move = cc.moveBy(0.2,cc.p(0,30)).easing(cc.easeCubicActionOut());
        var scale = cc.scaleTo(0.2,1.5,1.5).easing(cc.easeCubicActionOut());
        var fade = cc.fadeTo(0.2, 0);
        var callback = cc.callFunc(function(){
            point.destroy();
        },this);
        point.runAction(cc.sequence(cc.spawn(move,scale,fade),callback));
    },
});
