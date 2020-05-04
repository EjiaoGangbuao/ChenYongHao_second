
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
                    axios.post("http://47.97.204.234:3000/user/alterInfo",{
                        userId : myId,
                        direction : i,
                        content : personalInputElem[i].value,
                    })
                    .then(function(res){
                        console.log(res.data);
                    })
                    .catch(function(error){
                        console.log(error);
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
        axios.get("http://47.97.204.234:3000/user/getInfo",{
            params : {
                userId : myId,
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
        .catch(function(error){
            console.log(error);
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
            url:'http://47.97.204.234:3000/user/alterAvatar',
            data:formData,
            processData:false,
            contentType:false,
            xhrFields: {
                withCredentials:true
            },

            success:function(data){
                console.log(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息   
                console.log(textStatus);
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
                axios.post("http://47.97.204.234:3000/user/alterInfo",{
                    userId : myId,
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

    toMyHome.onclick = function(){
        personal.style.display = "block";
        homeIndex.style.display = "none";
        getUserPersonalInfo();
    }

    toIndex.onclick = function(){
        personal.style.display = "none";
        homeIndex.style.display = "block";
    }

    //测试
    var testBtn = document.getElementById("test");

    testBtn.onclick = function(){
        getUserPersonalInfo();
    }




