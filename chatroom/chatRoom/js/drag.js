function drag(obj,title){//obj 拖拽的对象
    title=title ||obj;//如果传入标题，就拖拽标题，否则就拖拽obj

    //在div上按下鼠标才发生拖拽(现在变成在div中title上按下鼠标才能拖拽  取消事件冒泡）
    title.onmousedown=function(ev){
        //记录鼠标偏移（就是点击div的时候  不会鼠标固定在div的左上角）一定要注意是发生在“点击”时刻
        ev=ev || window.event;
        var disX=ev.clientX-obj.offsetLeft;// 鼠标偏移距离= 鼠标的坐标-div的offsetLeft
        var disY=ev.clientY-obj.offsetTop;
        //发生拖拽
        document.onmousemove=function(ev){
            ev=ev || window.event;
            //console.log("X坐标："+ev.clientX,"Y坐标："+ev.clientY);
            var l=ev.clientX-disX;//鼠标点击的时候 与div有距离偏移  不是固定在div的左上角
            var t=ev.clientY-disY;
            //限制拖拽范围
            if (l<0){//左边
                l=0;
            }
            var screenW=document.documentElement.clientWidth;
            if (l>screenW-obj.offsetWidth){//右边 可视窗口的宽度-div盒子的可见宽度
                l=screenW-obj.offsetWidth;
            }
            if (t<0){//上边
                t=0;
            }
            var screenH=document.documentElement.clientHeight;
            if (t>screenH-obj.offsetHeight){//下边 可视窗口的高度-div盒子的可见高度
                t=screenH-obj.offsetHeight;
            }
            obj.style.left=l+"px";
            obj.style.top=t+"px";
        };
        //松开鼠标 停止拖拽  需要放在按下里面  不然拖拽清不干净
        document.onmouseup=function(){
            document.onmousemove=null;
        };
        //避免圈选文字之后点击div拖拽出错
        return false;
    }
}
