
/*----------------聊天---------------- */
    var chat = document.getElementsByClassName("chat")[0];

    var NowChatFriendsId = '', // 现在聊天对象的id
        NowChatFriendsAvatar = '';  // 现在聊天对象的头像

// 打开聊天界面时，定时查询有没有新消息
    function getChatMsg(){
        var ReceiveMsgTimer = setInterval(function(){
            axios.get("/chat/getMessage",{
                params:{
                    userId : UserInfo.Id,
                }
            })
            .then(function(res){
                console.log(res.data);
                if(res.data.message == "获取成功"){ //有新消息则进入
                    var newMsgLength = res.data.newMessages.length;
                    for( var i = 0; i < newMsgLength; i++){
                        // 遍历新消息，如果是当前聊天对象发的，则生成在聊天窗口
                        if( res.data.newMessages[i].senderId == NowChatFriendsId ){
                            var ReceiveTime = new Date(res.data.newMessages[i].time).toLocaleString();
                            addOtherChatElem(ReceiveTime,NowChatFriendsAvatar,
                                res.data.newMessages[i].content);
                        }
                    }
                }
            })
        },4000);

        chat.onclick = function(){ // 点击旁边透明地方离开聊天窗口
            chat.style.display = "none";
            clearInterval(ReceiveMsgTimer); // 清除查询新消息的定时器
            document.onkeydown = "";    // 清除回车发送事件
            clearChildNode(messageBox); // 清除聊天信息
        }
    }

    var chatInput = document.getElementsByClassName("chat-input")[0];

    // 发送消息并生成到聊天框中
    function sendMsg(){

        //发送消息
        axios.post("/chat/sendMessage",{
            userId : UserInfo.Id,
            friendId : NowChatFriendsId,
            content : chatInput.value,
        })
        .then(function(res){
            console.log(res.data);

            var SendTime = new Date(res.data.time).toLocaleString();//更改时间格式
            addMyChatElem(SendTime,UserInfo.Avatar,chatInput.value);

            setTimeout(function(){
                chatInput.value = ""; // 0.25s后 清空输入框
            },250);
        })

    }

    var chatBox = document.getElementsByClassName("chat-box")[0];

    chatBox.onclick = function(e){
        stopBubble(e); // 阻止冒泡，点击聊天窗口不会退出聊天界面，点击外部的透明区域才会。
    }

    // 聊天对象的名字，显示在聊天界面的上方
    var chatNickname = document.getElementsByClassName("chat-nickname")[0];

    var messageBox = document.getElementsByClassName("message-box")[0];

    // 生成对方聊天信息的元素
    function addOtherChatElem(time,avatar,content){
        var message = document.createElement("div");
        message.setAttribute("class","other-message message");  
        
        var msgTime = document.createElement("div");// 消息发送的时间
        msgTime.setAttribute("class","message-time");
        msgTime.innerText = time;
        message.appendChild(msgTime);

        var msgBody = document.createElement("div"); // 消息主体
            msgBody.setAttribute("class","message-body");
            message.appendChild(msgBody);

        var avatarContainer = document.createElement("div"),   // 对方头像
            avatarImg = document.createElement("img");
        avatarContainer.setAttribute("class","msg-other-avatar-container msg-avatar");
        avatarImg.setAttribute("class","msg-other-avatar");
        avatarImg.setAttribute("src",avatar);
        avatarContainer.appendChild(avatarImg);
        msgBody.appendChild(avatarContainer);

        var msgContContainer = document.createElement("div"),   // 消息内容
            msgContent = document.createElement("div");
        msgContContainer.setAttribute("class","msg-other-content-container msg-content");
        msgContent.setAttribute("class","msg-other-content");
        msgContent.innerText = content;
        msgContContainer.appendChild(msgContent);
        msgBody.appendChild(msgContContainer);

        messageBox.appendChild(message);
    }

    // 生成自己聊天信息的元素
    function addMyChatElem(time,avatar,content){
        var message = document.createElement("div");
        message.setAttribute("class","my-message message");
        
        var msgTime = document.createElement("div");// 消息发送的时间
        msgTime.setAttribute("class","message-time");
        msgTime.innerText = time;
        message.appendChild(msgTime);

        var msgBody = document.createElement("div");     //消息主体
            msgBody.setAttribute("class","message-body my-msg-body");
            message.appendChild(msgBody);

        var avatarContainer = document.createElement("div"),// 自己的头像
            avatarImg = document.createElement("img");
        avatarContainer.setAttribute("class","msg-my-avatar-container msg-avatar");
        avatarImg.setAttribute("class","msg-my-avatar");
        avatarImg.setAttribute("src",avatar);
        avatarContainer.appendChild(avatarImg);
        msgBody.appendChild(avatarContainer);

        var msgContContainer = document.createElement("div"),// 消息内容
            msgContent = document.createElement("div");
        msgContContainer.setAttribute("class","msg-my-content-container msg-content");
        msgContent.setAttribute("class","msg-my-content");
        msgContent.innerText = content;
        msgContContainer.appendChild(msgContent);
        msgBody.appendChild(msgContContainer);

        messageBox.appendChild(message);
    }

    // 发送聊天信息
    var sendMsgBtn = document.getElementsByClassName("send-msg")[0];
    
    sendMsgBtn.onclick = function(){
        sendMsg();
    }