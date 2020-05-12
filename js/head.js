
/*----------------首页头部---------------- */
var headFixed = document.querySelector(".head-fixed");

// 首页右上角私信气泡，点击出现好友列表
    var bubbleMsg = document.querySelector(".head-fixed .user-info .msg-div .info-button"),
        dirMsg = document.querySelector(".head-fixed .user-info .dir-msg");

    bubbleMsg.onclick = function(e){
        if(getStyle(dirMsg,"display") == "none"){
            dirMsg.className = "dir-msg active";
        }else{
            dirMsg.className = "dir-msg";
        }
        stopBubble(e);
        headUserMenu.className = "user-menu";
    }

    dirMsg.onclick = function(e){
        stopBubble(e);
    }

// 首页右上角头像，点击出现用户菜单
    var avaterDiv = document.querySelector(".head-fixed .user-info .avatar-div"),
        headUserMenu = document.querySelector(".head-fixed .user-info .avatar-div .user-menu");

    avaterDiv.onclick = function(e){
        if(getStyle(headUserMenu,"display") == "none"){
            headUserMenu.className = "user-menu active";
        }else{
            headUserMenu.className = "user-menu";
        }
        stopBubble(e);
        dirMsg.className = "dir-msg";
    }

    headUserMenu.onclick = function(e){
        stopBubble(e);
    }

    // 用户菜单里的退出按钮
    var checkOut = document.querySelector(".head-fixed .user-info .avatar-div .check-out");

    checkOut.onclick = function(){ 
        outLogin(UserInfo.Username,UserInfo.Password);//退出登录
        clearChildNode(articleList) // 清空文章
        clearChildNode(friendsList);// 清空好友列表
        
        //清空存放各数据的数组
        articleIdArray = []; 
        for(var i = 0; i < articleNum; i++){
            commentIdArray[i] = [];
            addCommentFlag[i] = false;
        }
        friendsIdArray = []; 
        friendsAvatarArray = [];
        respondIdArray = [];
    }

// 生成好友列表--右上角好友列表气泡,下面三个函数是生成好友列表里的各个元素
    var friendsList = document.querySelector(".user-info .msg-list");

    // 生成一个好友框，包含某好友的信息
    function addFriends(avatar,nickname,introduction){
        var msgArea = document.createElement("div");
        msgArea.setAttribute("class","msg-area");
        
        msgArea.appendChild( addAvatar(avatar) );
        msgArea.appendChild( addFriendInfo(nickname,introduction) );
        friendsList.appendChild(msgArea);
    }

    // 好友的头像
    function addAvatar(avatar){
        var imgAvatar = document.createElement("img"),
            divAvatar = document.createElement("div");

        imgAvatar.setAttribute("src",avatar);
        divAvatar.setAttribute("class","avatar")

        divAvatar.appendChild(imgAvatar);
        return divAvatar;
    }

    // 好友的昵称，个人介绍
    function addFriendInfo(nickname,introduction){
        var divMsgInfo = document.createElement("div"),
            divNickname = document.createElement("div"),
            divIntroduction = document.createElement("div");

        divMsgInfo.setAttribute("class","msg-info");
        divNickname.setAttribute("class","nickname");
        divIntroduction.setAttribute("class","introduction");

        divNickname.innerText = nickname;
        divIntroduction.innerText = introduction;

        divMsgInfo.appendChild(divNickname);
        divMsgInfo.appendChild(divIntroduction);

        return divMsgInfo;
    }

    // 输出好友列表
    function outFriends(){
        axios.get("/user/friendList",{
            params:{
                userId : UserInfo.Id,
            }
        })
        .then(function(res){
            console.log(res.data);
            console.log(res.status);
            var FriLength = res.data.friends.length; // 好友个数

            var friendListArea = document.getElementsByClassName("msg-area");

            for(var i = 0; i < FriLength; i++){
                // 生成每个好友的信息，并填写到元素中
                addFriends(res.data.friends[i].avatar, res.data.friends[i].nickname, 
                    res.data.friends[i].introduction);
                // 将好友的头像和id存放在数组中;
                friendsIdArray.push(res.data.friends[i].userId);
                friendsAvatarArray.push(res.data.friends[i].avatar);

                // 按下出现聊天界面
                (function(i){
                    friendListArea[i].onclick = function(e){
                        stopBubble(e);
                        chat.style.display = "block";
                        NowChatFriendsId = friendsIdArray[i]; //当前聊天对象的id和头像
                        NowChatFriendsAvatar = friendsAvatarArray[i];
            
                        axios.get("/user/friendList",{
                            params : {
                                userId : UserInfo.Id,
                            }
                        })
                        .then(function(res){
                            console.log(res.data);
                            chatNickname.innerText = res.data.friends[i].nickname;
                            getChatMsg();
                        })
                        // 按回车发送消息
                        document.onkeydown = function(e){
                            if(!e){
                                e = window.event; // 兼容
                            }
                            if((e.keyCode || e.which) == 13){
                                sendMsg();
                            }
                        }
                    }
                }(i));
            }
        })
    }

    var headAvatarImg = document.querySelector(".head-fixed .user-info .avatar-div img");

    var htmlElem = document.getElementsByTagName("html")[0];

    htmlElem.onclick = function(){  // 好友列表和点击右上角头像出现的选项菜单，点击其他地方可以使这俩隐藏
        headUserMenu.className = "user-menu";
        dirMsg.className = "dir-msg";
    }