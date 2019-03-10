//手指按下的坐标
var startX = 0;
var startY = 0;
//手指在canvas上移动的坐标
var moveX = 0;
var moveY = 0;
//移动位置和开始位置的差值
var X = 0;
var Y = 0;
//蛇头的对象
var snakeHead = {
    x: 0,
    y: 0,
    color: "#f00",
    width: 20,
    height: 20
}

//身体的对象(数组)
var snakeBodys = [];

//食物的对象
var foods = [];

//窗口的宽高
var windowWidth = 0;
var windowHeight = 0;

//用于确定是否删除
var collideBool = true;
//手指的方向
var direction = null;

// 蛇移动的方向
var snakeDirection = "right";
Page({
    canvasStart:function (e) {
        // console.log(e.touches);
        startX = e.touches[0].x;
        startY = e.touches[0].y;        
    },
    canvasMove: function (e) {
        // console.log(e.touches);
        moveX = e.touches[0].x;
        moveY = e.touches[0].y;

        X = moveX - startX;
        Y = moveY - startY;
        
        if(Math.abs(X) > Math.abs(Y) && X > 0){
            direction = "right";
        } else if (Math.abs(X) > Math.abs(Y) && X < 0){
            direction = "left";
        } else if (Math.abs(Y) > Math.abs(X) && Y > 0){
            direction = "bottom";
        } else if (Math.abs(Y) > Math.abs(X) && Y < 0){
            direction = "top";
        }
    },
    canvasEnd: function () {
        snakeDirection = direction;
    },
    onReady: function () {
        //获取画布的上下文
        var context = wx.createContext();
        //帧数
        var frameNum = 0;

        function draw(obj) {
            context.setFillStyle(obj.color);//填充颜色
            context.beginPath();
            context.rect(obj.x, obj.y, obj.width, obj.height);
            context.closePath();
            context.fill();
        }
        //碰撞函数
        function collide(objSnake, objFood) {
            var leftSnake = objSnake.x;
            var rightSnake = leftSnake + objSnake.width;
            var topSnake = objSnake.y;
            var bottomSnake = topSnake + objSnake.height;

            //四边重叠，说明撞上了
            var leftFood = objFood.x;
            var rightFood = leftFood + objFood.width;
            var topFood = objFood.y;
            var bottomFood = topFood + objFood.height;

            if (rightSnake > leftFood && leftSnake < rightFood && bottomSnake > topFood && topSnake < bottomFood){
                return true;
            }else{
                return false;
            }
        }
        function animate() {
            frameNum++;

            if (frameNum % 20 == 0){
                //向蛇身体数组添加一个上一个的位置(身体对象)
                snakeBodys.push({
                    x: snakeHead.x,
                    y: snakeHead.y,
                    color: 　"#00f",
                    width: 20,
                    height: 20,
                });
                //改变方向
                switch (snakeDirection) {
                    case "left":
                        snakeHead.x -= snakeHead.width;
                        break;
                    case "right":
                        snakeHead.x += snakeHead.width;
                        break;
                    case "top":
                        snakeHead.y -= snakeHead.height;
                        break;
                    case "bottom":
                        snakeHead.y += snakeHead.height;
                        break;
                };
                if (snakeBodys.length > 4) {
                    //移出不用的身体
                    if(collideBool){
                        snakeBodys.shift();//删除数组的第一位
                    }else{
                        collideBool = true;
                    }
                }
            }
            //绘制蛇头
            draw(snakeHead);
            //绘制蛇身,有多少节身体就绘制多少次
            for(var i = 0; i < snakeBodys.length; i++){
                var snakeBody = snakeBodys[i];
                draw(snakeBody);
            }
            
            //绘制食物
            for(var i=0;i<foods.length;i++){
                var foodObj = foods[i];
                draw(foodObj);
                //撞上食物的时候给食物重置位置
                if(collide(snakeHead,foodObj)){
                    collideBool = false;
                    foodObj.reset();
                }
            }
            wx.drawCanvas({
                canvasId: 'sankCanvas',
                actions: context.getActions()
            })
            requestAnimationFrame(animate);
        }    
        function rand(min,max) {
                return parseInt(Math.random() * (max - min)) + min;
        }
        //构造食物对象
        function Food() {
            this.x = rand(0, windowWidth);
            this.y = rand(0, windowHeight);
            var w = rand(10,20);
            this.width = w;
            this.height = w;

            this.color = "rgb("+rand(0,255)+","+rand(0,255)+","+rand(0,255)+")";
            this.reset = function () {//撞上之后改变食物位置
                this.x = rand(0, windowWidth);
                this.y = rand(0, windowHeight);
                this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
            }
        }
        //取到窗口的宽高
        wx.getSystemInfo({
            success:function (res) {
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
                console.log(res);
                for(var i = 0 ; i < 20 ; i++){
                    var foodObj = new Food();
                    foods.push(foodObj);
                }
                animate(); 
            }
        })    
    }
})