/*----------------（退出）登录---------------- */

    var signIn = document.querySelector(".sign-in"),
        signInBtn = document.querySelector(".sign-in .login-button");

    var inputPassword = document.querySelector(".sign-in .password input"),
        inputAccount = document.querySelector(".sign-in .account input"),
        sAhPassword = document.querySelector(".sign-in .password i");
    var outLoginBtn = document.querySelector(".sign-in .login-button.button2");

// 登录页面的登录函数
    function login(nowUsername,nowPassword){
        axios.post("/user/login",{
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

                UserInfo.Id = res.data.userId;
                inputAccount.value = "";
                inputPassword.value = "";
                
                outFriends(); //登录成功--加载好友列表，该函数代码在head.js里
                getUserInfo();
                getArticle();
            }else{
                console.log(res.data);
            }
        })
    }

// 退出登录
    function outLogin(){
        axios.post("/user/logout",{
            username : UserInfo.Username,
            password : UserInfo.Password,
        })
        .then(function (res) {
            console.log(res.data);
            
            signIn.style.display = "flex";
            homeIndex.style.display = "none";
            headFixed.style.display = "none";
            personal.style.display = "none";

            UserInfo.Username = "";
            UserInfo.Password = "";
            UserInfo.Id = '';
        })
    }

// 登录页面的登录按钮
    signInBtn.onclick = function(e){
        cancelHandler(e);
        var nowUsername = inputAccount.value;
        var nowPassword = inputPassword.value;
        login(nowUsername,nowPassword);
    }

// 登录页面的退出登录按钮，不删除了，见记录.md
    outLoginBtn.onclick = function(e){
        cancelHandler(e);
        var nowUsername = inputAccount.value;
        var nowPassword = inputPassword.value;
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

