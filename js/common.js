/*----------------通用---------------- */
    // 阻止默认事件
    function cancelHandler(event){  
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    }

    // 获取元素css属性值
    function getStyle(elem, prop){
        if(window.getComputedStyle){
            return window.getComputedStyle(elem, null)[prop];
        }else{
            return elem.currentStyle[prop];
        }
    }

    // 阻止冒泡
    function stopBubble(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    }

    //绑定事件处理函数，兼容性方法
    function addEvent(elem, type, handle){
        if(elem.addEventListener){
            elem.addEventListener(type, handle, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on' + type + function (){
                handle.call(elem);
            })
        }else{
            elem['on' + type] = handle;
        }
    }

    // 清空子节点
    function clearChildNode(elem){
        while(elem.hasChildNodes()){
            elem.removeChild(elem.firstChild);
        }
    }

    //携带cookie
    axios.defaults.withCredentials = true;

    axios.defaults.baseURL = "http://47.97.204.234:3000";
    var baseUrl = "http://47.97.204.234:3000";

    // 存当前用户的信息
    var UserInfo = {
        Id : '',
        Username : '',
        Password : '',
        Avatar : '',
    }

    var articleNum = 19;

    // 文章ID数组
    var articleIdArray = []; 

    //好友id数组
    var friendsIdArray = []; 

    // 好友头像url数组
    var friendsAvatarArray = [];

    // 评论id二维数组，行是第几篇文章，列是评论
    var commentIdArray = new Array(articleNum);
    for(var i = 0; i < commentIdArray.length; i++){
        commentIdArray[i] = [];
    }

    // 回复id数组
    var respondIdArray = new Array();
