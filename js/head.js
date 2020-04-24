// 获取元素css属性值
function getStyle(elem, prop){
    if(window.getComputedStyle){
        return window.getComputedStyle(elem, null)[prop];
    }else{
        return elem.currentStyle[prop];
    }
}

var headFixed = document.querySelector(".head-fixed");

// 首页右上角私信气泡，点击出现好友列表
    var bubbleMsg = document.querySelector(".head-fixed .user-info .msg-div .info-button"),
        dirMsg = document.querySelector(".head-fixed .user-info .dir-msg");

    bubbleMsg.onclick = function(){
        if(getStyle(dirMsg,"display") == "none"){
            dirMsg.style.display = "block";
        }else{
            dirMsg.style.display = "none";
        }
    }

// 首页右上角头像，点击出现用户菜单
    var avaterDiv = document.querySelector(".head-fixed .user-info .avatar-div"),
        headUserMenu = document.querySelector(".head-fixed .user-info .avatar-div .user-menu");

    avaterDiv.onclick = function(){
        if(getStyle(headUserMenu,"display") == "none"){
            headUserMenu.style.display = "block";
        }else{
            headUserMenu.style.display = "none";
        }
    }

    // 用户菜单里的退出按钮
    var checkOut = document.querySelector(".head-fixed .user-info .avatar-div .check-out");

    checkOut.onclick = function(){
        outLogin(nowUsername,nowPassword);
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

        divNickname.innerHTML = nickname;
        divIntroduction.innerHTML = introduction;

        divMsgInfo.appendChild(divNickname);
        divMsgInfo.appendChild(divIntroduction);

        return divMsgInfo;
    }

    // 输出好友列表
    function outFriends(myId){
        axios.get("http://47.97.204.234:3000/user/friendList",{
            params:{
                userId : myId,
            }
        })
        .then(function(res){
            console.log(res.data);
            console.log(res.status);
            var FriLength = res.data.friends.length;

            for(var i = 0; i < FriLength; i++){
                addFriends(res.data.friends[i].avater, res.data.friends[i].nickname, res.data.friends[i].introduction);
            }
        })
    }

