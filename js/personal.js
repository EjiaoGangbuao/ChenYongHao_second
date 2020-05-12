/*----------------个人主页---------------- */
    var personal = document.getElementsByClassName("personal")[0];
    var writeOrChange = document.getElementsByClassName("writeOrChange"),
        personalInput = document.getElementsByClassName("personal-input"),
        personalEveryInfo = document.getElementsByClassName("personal-every-info"),
        personalInputElem = document.querySelectorAll(".personal-input .input-elem");

    var saveInput = document.getElementsByClassName("save-input"),
        cancelInput = document.getElementsByClassName("cancel-input");

    // 修改个人信息的按钮事件
    for(var i = 0; i < writeOrChange.length; i++){
        (function(i){
            // 修改按钮
            writeOrChange[i].onclick = function(){
                personalInput[i].style.display = "block";
                writeOrChange[i].style.display = "none";
                personalEveryInfo[i].style.display = "none";
            }

            // 取消按钮
            cancelInput[i].onclick = function(){
                writeOrChange[i].style.display = "inline-block";
                personalInput[i].style.display = "none";
                personalEveryInfo[i].style.display = "inline-block";
            }

            // 保存按钮
            saveInput[i].onclick = function(){
                if( i != 1 ){
                    axios.post("/user/alterInfo",{
                        userId : UserInfo.Id,
                        direction : i,
                        content : personalInputElem[i].value,
                    })
                    .then(function(res){
                        console.log(res.data);
                    })
                }else{
                    selectGender();
                }
                
                setTimeout(getUserPersonalInfo,500);
                cancelInput[i].onclick();
            }
        }(i))
    }

    // 获取信息，并填写在个人主页里
    function getUserPersonalInfo(){
        axios.get("/user/getInfo",{
            params : {
                userId : UserInfo.Id,
            }
        })
        .then(function(res){
            console.log(res.data);
            var nickname = document.querySelector(".personal-nickname h2"),
                avatar = document.querySelector(".personal-avatar"),
                gender = document.querySelector(".gender-child"),
                oneSentence = document.querySelector(".one-sentence-child"),
                professional = document.querySelector(".professional-child"),
                introduction = document.querySelector(".introduction-child");

            nickname.innerHTML = res.data.info.nickname;
            avatar.setAttribute("src",res.data.info.avatar);
            gender.innerHTML = res.data.info.gender;
            oneSentence.innerHTML = res.data.info.introduction;
            professional.innerHTML = res.data.info.trade;
            introduction.innerHTML = res.data.info.resume;

        })
    }

    // 上传，改头像
    var submitAvatarBtn = document.getElementById("submit-avatar");

    submitAvatarBtn.onclick = function(){
        var file = $("#select-avatar").get(0).files[0];
        console.log(file);

        var formData = new FormData();
        formData.append("image1",file);
        $.ajax({
            type:'post',
            url: baseUrl + '/user/alterAvatar',
            data:formData,
            processData:false,
            contentType:false,
            xhrFields: {
                withCredentials:true
            },
            success:function(data){
                console.log(data);
            }
        })
    }

    // 修改性别
    function selectGender(){
        var flags = false,
            gender = "",
            i = 0,
            personalRadio = document.querySelectorAll(".personal-radio-container input.radio");
            for( i = 0; i < personalRadio.length; i++){
                if(personalRadio[i].checked == true){
                    flags = true;
                    if( i == 0){
                        gender = "男";
                    }else{
                        gender = "女";
                    }
                    break;
                }
            }
            if(flags == false){
                alert("没选择性别你保存个啥");
            }else{
                axios.post("/user/alterInfo",{
                    userId : UserInfo.Id,
                    direction : 1,
                    content : gender,
                })
                .then(function(res){
                    console.log(res.data);
                })
            }
    }

    var toMyHome = document.getElementsByClassName("my-home")[0],
        toIndex = document.getElementsByClassName("back-to-index")[0];

    toMyHome.onclick = function(){ // 来到个人主页
        personal.style.display = "block";
        homeIndex.style.display = "none";
        getUserPersonalInfo();
    }

    toIndex.onclick = function(){ // 返回首页
        personal.style.display = "none";
        homeIndex.style.display = "block";
    }




