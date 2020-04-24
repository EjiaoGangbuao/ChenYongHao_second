
// 阻止默认事件
function cancelHandler(event){  
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}

    var signIn = document.querySelector(".sign-in"),
        signInBtn = document.querySelector(".sign-in .login-button");

    var inputPassword = document.querySelector(".sign-in .password input"),
        inputAccount = document.querySelector(".sign-in .account input"),
        sAhPassword = document.querySelector(".sign-in .password i");
    var outLoginBtn = document.querySelector(".sign-in .login-button.button2");


    var myId = 0, // 用户id
        nowUsername = "", // 目前的用户名
        nowPassword = ""; // 目前的密码


// 登录页面的登录函数
    function login(nowUsername,nowPassword){
        axios.post("http://47.97.204.234:3000/user/login",{
            username : nowUsername,
            password : nowPassword,
        })
        .then(function (res) {
            if(res.data.result == "success"){
                console.log(res.data);
                console.log(res.status);

                signIn.style.display = "none"
                homeIndex.style.display = "block";
                headFixed.style.display = "block";

                myId = res.data.userId;
                inputAccount.value = "";
                inputPassword.value = "";
                

                outFriends(myId); //登录成功--加载好友列表，该函数代码在head.js里
            }else{
                console.log(res.data);
                console.log(res.status);
            }
        })
    }

// 退出登录
    function outLogin(nowUsername,nowPassword){
        axios.post("http://47.97.204.234:3000/user/logout",{
            username : nowUsername,
            password : nowPassword,
        })
        .then(function (res) {
            console.log(res.data);
            console.log(res.status);
            myId = 0;
            signIn.style.display = "flex";
            homeIndex.style.display = "none";
            headFixed.style.display = "none";
            nowUsername = "";
            nowPassword = "";
        })
    }

// 登录页面的登录按钮
    signInBtn.onclick = function(e){
        cancelHandler(e);
        nowUsername = inputAccount.value;
        nowPassword = inputPassword.value;
        login(nowUsername,nowPassword);
    }

// 登录页面的退出登录按钮，目前作测试用，日后删除
    outLoginBtn.onclick = function(e){
        cancelHandler(e);
        outLogin(nowUsername,nowPassword);
    }

// 登录页面的密码显示or隐藏按钮
    sAhPassword.onclick = function(){
        if(inputPassword.getAttribute("type") == "text"){
            inputPassword.setAttribute("type","password");
        }else{
            inputPassword.setAttribute("type","text");
        }
    }

