cc.Class({
    extends: cc.Component,

    properties: {
        // 控制移动的barrier
        targetBarrier:{
            default:null,
            type:cc.Node
        },
        moveX:0,
        moveY:0,
        moveDuration:0,
        destroyThen:false,
    },
    onLoad: function () {

    },
    onCollisionEnter:function(other,self){
        var _this = this;
        if(other.node.name == "cube"){
            var barrier = this.targetBarrier;
            var callback = cc.callFunc(function(){
                if(_this.destroyThen){
                    barrier.destroy();
                }
            },this);
            if(barrier){
                var move = cc.moveBy(this.moveDuration, cc.p(this.moveX,this.moveY)).easing(cc.easeCubicActionOut());
                barrier.runAction(cc.sequence(move,callback));
            }
        }
    }
});
