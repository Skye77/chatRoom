$(function() {
    $("#chatroom").hide();

    //1.登录页面头像选择
    var timer;
    $(".iconMe").find("p").hover(function () {
        $(".selIcon").show();
        //点击selIcon中头像替换原头像
        $(".selIcon").on("mouseover", function () {
            clearTimeout(timer);
            $(this).find("li").hover(function () {
                $(this).css("border-color", "red").siblings().css("border-color", "");
            }, function () {
                $(this).css("border-color", "");
            });
        }).find("li").on("click", function (eve) {
            eve.stopPropagation();//阻止点击事件向上传播（冒泡）到文档点击事件
            $(".iconMe").find("p").html($(this).html());
            $(".selIcon").hide();
            //获得选择头像的属性值，并付给聊天框中的头像
            var temp1=$(this).find("img").attr("src");
            $(".selfIcon").find("img").attr("src",temp1);
            $(".nowUser i").find("img").attr("src",temp1);
            $(".selfMsg").find("i").find("img").attr("src",temp1);

        });
    }, function () {
        var $this = $(this);
        timer = setTimeout(function () {
            $(".selIcon").hide();
        }, 300);
    });
    $(document).on("click", function () {
        $(".selIcon").hide();
    });

    //2.currNum 动画
    var images=["pictab1.jpg","pictab2.jpeg","pictab3.jpg","pictab4.jpg","pictab5.jpg","pictab6.jpg","pictab7.jpg"];
    var index1=1;
    setInterval(function(){
        if (index1==images.length) index1=0;
        $(".picTab").animate({"opacity":0},800,function(){
            $(".picTab").css("backgroundImage",'url("images/'+images[index1]+'")')
                .animate({"opacity":1},800);
            index1++;
        })
    },4000);

    //3.拖拽
    var oWel=document.getElementById("welcome");
    var oTopW=document.getElementById("loginTop");
    drag(oWel,oTopW);

    //4. 显示时间
    setInterval(function(){
        var dateNow=new Date().toLocaleString();
        $(".timeNow").html(dateNow);
    },1000);

    //获取性别与状态的属性值
    $(".genderMe").find("input").on("click",function(){
        var temp2=$(this).val();
        console.log(temp2);
        var cont1="<img src='images/"+getGen(temp2)+"'>";
        $(".nowUser").find(".addStatu a").eq(0).html(cont1);
    });
    $(".statusMe").find("input").on("click",function(){
        var temp3=$(this).val();
        console.log(temp3);
        var cont2=getStatus(temp3);
        $(".nowUser").find(".addStatu a").eq(1).html(cont2);
    });

    function getGen(userGen){
        var gen="nan.jpg";
        var gens={
            "男生":"nan.jpg",
            "女生":"nv.jpg"
        };
        return gens[userGen] || gen;
    }
    function getStatus(userSta){
        var sta="[在线]";
        var stas={
            "在线":"[在线]",
            "忙碌":"[忙碌]"
        };
        return stas[userSta] || sta;
    }


    // 1. 标志变量，标志用户是否已登录
    var isLogin = false;

    // 2. 和socket服务器建立连接，获得客户端的socket对象
    // 会发起向服务器的连接请求
    var clientSocket = io();

    // 3.  监听服务器端发过来的消息
    clientSocket.on("hello", function (data) {
        alert("服务器端说：" + data);
    });

    //7. 客户端socket监听服务器发过来的消息
    clientSocket.on("message", function (data) {
        var type = data.type;   // 提交消息类型
        // 7.1 根据消息类型，作出相应的处理
        switch (type) {
            case "100": // 自己已经登入聊天室
                isLogin = true;
                showChatPanel(data);    // 显示聊天面板
                break;
            case "101": // 系统消息，有新用户进入聊天室
                if (isLogin) showWelcomeMsg(data);
                break;
            case "102": // 系统消息，有用户离开聊天室
                if (isLogin) showUserLeave(data);
                break;
            case "200": // 自身的聊天信息
                if (isLogin) showSelfChatMsg(data);
                break;
            case "201": // 群发的其他用户聊天信息
                if (isLogin) showChatMsg(data);
                break;
        }
    });

    //8.message窗口显示消息
    //8.1 滚动窗口的函数
    function scroll(){
        // 有多远，滚多远
        $("#box").scrollTop($("#box").prop("scrollHeight"));
    }


    var n=0;
    // 8.2 在聊天窗口显示用户离开聊天室的消息
    function showUserLeave(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'><span>[系统消息]" + data.nickname + "离开了聊天室</span></div>";
        $("#messages").append(welcome);
        scroll();   // 滚动窗口到最底部

        n=data.userList.length;

        var userCont="<div class='nowNum'>当前有"+(n-1)+"人在线:</div>";
        $.each(data.userList,function(index,user){
            userCont+='<div class="nowUser"><i><img src="images/icon011.jpg"></i>';
            userCont+= '<span>';
            userCont+=data.userList[index].nickname;
            userCont+='</span><br>';
            userCont+= '<div class="addStatu"><a href="#"><img src="images/nan.jpg" alt=""></a><a href="#">[在线]</a></div><a class="alone" href="javascript:;">[私聊]</a>';
            userCont+='</div>';
        });
        $("#userNum").html(userCont);
    }

    // 8.3 在聊天窗口显示自己身的聊天信息
    function showSelfChatMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='selfMsg'><span>" + data.content + "</span><i><img src='images/icon7.jpg'></i></div>";
        $("#messages").append(welcome);

        scroll();   // 滚动窗口到最底部
    }

    // 8.4 在聊天窗口显示其他用户的聊天信息
    function showChatMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='userMsg'><span>" + data.content + "</span><i><s>"+data.nickname+"</s><img src='images/icon10.jpg'></i></div>";
        $("#messages").append(welcome);

        scroll();   // 滚动窗口到最底部
    }

    // 8.5 在聊天窗口显示欢迎新用户的消息
    function showWelcomeMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'><span>[系统消息]欢迎新用户," + data.nickname + "!</span></div>";
        $("#messages").append(welcome);

        scroll();   // 滚动窗口到最底部
    }

    // 7.2 显示聊天界面的函数
    function showChatPanel(data) {
        // 隐藏登录界面
        $("#welcome").hide();

        // 显示聊天界面
        $("#chatroom").show();

        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'><span>[系统消息]您已进入聊天室，请文明聊天!</span></div>";
        $("#messages").append(welcome);

        n=data.userList.length;
        var userCont="<div class='nowNum'>当前有"+n+"人在线:</div>";
        $.each(data.userList,function(index,user){
            userCont+='<div class="nowUser"><i><img src="images/icon011.jpg"></i>';
            userCont+= '<span>';
            userCont+=data.userList[index].nickname;
            userCont+='</span><br>';
            userCont+= '<div class="addStatu"><a href="#"><img src="images/nan.jpg" alt=""></a><a href="#">[在线]</a></div><a class="alone" href="javascript:;">[私聊]</a>';
            userCont+='</div>';
        });
        $("#userNum").html(userCont);
    }

    // 5.响应用户登录事件
    $("#startchat").on("click", function () {
        // 获取用户输入的昵称
        var nickname = $.trim($("#nickname").val());

        // 对昵称进行合法性验证(格式(是否为空..),有效性)
        if (nickname==""){
            alert("想一个好听的昵称吧，拒绝空昵称哦...");
            return;
        }

        // 构造要发给服务器端的消息内容
        var content = {
            type: "101",    // 代表用户登录
            nickname: nickname
        };

        // 发送登录信息给服务器端
        clientSocket.send(content); // send默认发送的是"message"
    });

    // 6. 发送聊天内容
    var re=/去你的|去死|靠|你大爷/g;
    $("#send").on("click", function () {
        // 获取用户输入的聊天内容
        var content = $.trim($("#message").val());

        // 非空验证、敏感词过滤等
        content=content.replace(re,function(str){
            var result="";
            for(var i=0;i<str.length;i++){
                result+="*";
            }
            return result;
        });

        // 发送给服务器端：先构造要发送的消息结构
        var message = {
            type: "201",    // 类型是公共聊天内容
            content: content
        };
        clientSocket.send(message);

        // 清空输入框
        $("#message").val("");
    });

    // 回车发送聊天内容
    $("#message").on("keyup", function (e) {
        // 判断是否按下了回车键
        if (e.keyCode == 13) {
            $("#send").click();
        }
    });
});
