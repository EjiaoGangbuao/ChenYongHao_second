/*----------------首页---------------- */
    var homeIndex = document.querySelector(".Home");
    
    //同一篇文章下的评论的父元素
    var commentListUl = document.getElementsByClassName("comment-list"); 

    //所有文章的父元素
    var articleList = document.querySelector(".main-list ul.article");
    
    // 每个文章下面评论的评论数
    var comHeadNum = document.getElementsByClassName("comment-head-num");

    // 打开评论的按钮
    var openComBtn = document.getElementsByClassName("openComment");

    // 每篇文章下的评论整个元素
    var oneComment = document.getElementsByClassName("comment-all");

    // 文章的踩、赞同按钮 + 赞同按钮的文本
    var disagreeBtn = document.getElementsByClassName("disagree"),
        agreeBtn = document.getElementsByClassName("agree"),
        agreeText = document.getElementsByClassName("agree-text");

    //发布评论
    var submitComBtn = document.getElementsByClassName("submit-comment"),
        comInput = document.getElementsByClassName("comment-input-child");

    // 判断生成评论
    var addCommentFlag = [];
    for(var i = 0; i < articleNum; i++){
        addCommentFlag.push(false);
    }

    // 检查登录状态
    function checkLogin(){
        axios.get("/user/state")
        .then(function(res){
            console.log(res.data);
            if(res.data.result == "success"){
                UserInfo.Id = res.data.userId;
                signIn.style.display = "none"
                headFixed.style.display = "block";

                outFriends();
                getUserInfo();
                getArticle();
            }else{
                UserInfo.Id = '';
            }
        })
    }

    checkLogin();

    // 获取用户的信息
    function getUserInfo(){
        if(UserInfo.Id != ''){
            axios.get("/user/getInfo",{
                params:{
                    userId : UserInfo.Id,
                }
            })
            .then(function(res){
                headAvatarImg.setAttribute("src",res.data.info.avatar);
                UserInfo.Username = res.data.info.nickname;
                UserInfo.Password = "123";
                UserInfo.Avatar = res.data.info.avatar;
                console.log("获取用户信息成功");
            })
        }
    }


    // 获取文章
    function getArticle(){
        axios.get("/article/getArticles",{
            params:{
                userId : UserInfo.Id,
                start : 0,
                stop : articleNum - 1,
            }
        })
        .then(function(res){
            for(var i = 0; i < articleNum; i++){
                addArticles(res.data.articles[i].title, res.data.articles[i].content, res.data.articles[i].likeNum, res.data.articles[i].commentNum);
                articleIdArray.push(res.data.articles[i].articleId);
                
                // 阅读全文/收起
                (function(i){
                    var articleAll = document.getElementsByClassName("all-article")[i],
                        articleContent = document.getElementsByClassName("article-content")[i];

                    articleAll.onclick = function(){
                        if(articleAll.innerText == "阅读全文 ∨"){
                            articleContent.style.whiteSpace = "normal";
                            articleContent.style.textOverflow = "initial";
                            articleAll.innerText = "收起 ^";
                        }else{
                            articleContent.style.whiteSpace = "nowrap";
                            articleContent.style.textOverflow = "ellipsis";
                            articleAll.innerText = "阅读全文 ∨";
                        }
                    }

                    // 赞/踩按钮
                    agreeBtn[i].onclick = function(){
                        likeArticle(i);
                    }
                    disagreeBtn[i].onclick = function(){
                        dislikeArticle(i);
                    }

                    // 判断是否已经点赞/点踩
                    if(res.data.articles[i].liked == true){
                        areadyLikeArticle(i);
                    }
                    if(res.data.articles[i].disliked == true){
                        areadyDislikeArticle(i);
                    }

                    //生成评论整体结构
                    addCommentWrapper(i);

                    // 打开评论按钮
                    openComBtn[i].onclick = function(){
                        //生成评论
                        if(addCommentFlag[i] == false){
                            var comLength = res.data.articles[i].commentNum;
                            var totalPageNum = (comLength - comLength%10)/10 + 1; // 总页数
    
                            getComments(i); // 获取评论
    
                            setTimeout(function(){
                                addPagingCommentElem(i,totalPageNum,comLength); // 0.5s后生成评论页数
                            },500);
    
                            if(comHeadNum[i]){
                                comHeadNum[i].innerHTML = res.data.articles[i].commentNum;
                            }
    
                            submitComment(i);//发布评论

                            addCommentFlag[i] = true;
                        }
                        
                        if( getStyle((oneComment[i]),"display") == "none"){
                            oneComment[i].style.display = "block";
                        }else{
                            oneComment[i].style.display = "none";
                        }
                    }
                }(i))
            }

            console.log("获取文章成功");
        })
    }
    
// ----------------------------------------
    // 生成文章的函数
    function addArticles(artTitle, artContent, LikeNum, CommentNum){
        var articleChild = document.createElement("li");
        articleChild.setAttribute("class","article-child");

        articleChild.appendChild( addLiH2(artTitle) ); // h2
        articleChild.appendChild( addLiP(artContent) ); // p
        articleChild.appendChild( addLiBtn(LikeNum,CommentNum) ); // button

        articleList.appendChild(articleChild);
    }
    
    function addLiH2(artTitle){
        var h2Title = document.createElement("h2");
        h2Title.innerHTML = artTitle;
        return h2Title;
    }

    function addLiP(artContent){
        var pContent = document.createElement("p"),
            spanContent = document.createElement("span"),
            buttonContent = document.createElement("button");

        buttonContent.setAttribute("class","all-article");
        spanContent.setAttribute("class","article-content");

        buttonContent.innerHTML = "阅读全文 ∨";
        spanContent.innerHTML = artContent;

        pContent.appendChild(spanContent);
        pContent.appendChild(buttonContent);
        return pContent;
    }

    function addLiBtn(agreeNumber,commentNum){
        var divBtn = document.createElement("div"); // 总

        divBtn.setAttribute("class","various-button");

        var spanBlueBtn = document.createElement("span"), // 蓝色赞踩按钮
            agreeBtn = document.createElement("button"),
            agreeSpan = document.createElement("span"),
            agreeNum = document.createElement("span"),
            disagreeBtn = document.createElement("button");

        spanBlueBtn.setAttribute("class","blue-btn-list");
        agreeBtn.setAttribute("class","blue-button agree");
        agreeSpan.setAttribute("class","agree-text");
        agreeNum.setAttribute("class","agree-num");
        disagreeBtn.setAttribute("class","blue-button disagree");



        agreeSpan.innerHTML = "▲ 赞同 ";
        agreeNum.innerHTML = agreeNumber;
        disagreeBtn.innerHTML = "▼";

        var spanGrayBtn = document.createElement("span"), // 灰色各类按钮--有功能
            commentBtn = document.createElement("button"),
            iComment = document.createElement("i"),
            spanCommentNum = document.createElement("span"),
            spanCommentText = document.createElement("span");

        spanGrayBtn.setAttribute("class","gray-btn-list");
        commentBtn.setAttribute("class","gray-button openComment");
        iComment.setAttribute("class","iconfont icon-qipao");
        spanCommentNum.setAttribute("class","comment-num");
        spanCommentText.setAttribute("class","comment-text");

        spanCommentNum.innerHTML = " " + commentNum + " ";
        spanCommentText.innerHTML = "条评论"

        spanBlueBtn.appendChild(agreeBtn);
        spanBlueBtn.appendChild(disagreeBtn);
        agreeBtn.appendChild(agreeSpan);
        agreeBtn.appendChild(agreeNum);

        spanGrayBtn.appendChild(commentBtn);
        commentBtn.appendChild(iComment);
        commentBtn.appendChild(spanCommentNum);
        commentBtn.appendChild(spanCommentText);

        var shareBtn = document.createElement("button"), // --无功能按钮
            collectBtn = document.createElement("button"),
            uselessLikeBtn = document.createElement("button"),
            iShare = document.createElement("i"),
            icollect = document.createElement("i"),
            iLike = document.createElement("i"),
            shareText = document.createTextNode(" 分享"),
            collectText = document.createTextNode(" 收藏"),
            likeText = document.createTextNode(" 喜欢");

            shareBtn.className = "gray-button uselessBtn";
            collectBtn.className = "gray-button uselessBtn";
            uselessLikeBtn.className = "gray-button uselessBtn";
            iShare.className = "iconfont icon-zhifeiji";
            icollect.className = "iconfont icon-xing";
            iLike.className = "iconfont icon-bqxin";

            shareBtn.appendChild(iShare);
            shareBtn.appendChild(shareText);
            collectBtn.appendChild(icollect);
            collectBtn.appendChild(collectText);
            uselessLikeBtn.appendChild(iLike);
            uselessLikeBtn.appendChild(likeText);

            spanGrayBtn.appendChild(shareBtn);
            spanGrayBtn.appendChild(collectBtn);
            spanGrayBtn.appendChild(uselessLikeBtn);

        divBtn.appendChild(spanBlueBtn);
        divBtn.appendChild(spanGrayBtn);

        return divBtn;
    }
// ----------------------------------------
    // （取消）赞同函数
    function likeArticle(j){ 
        if(document.getElementsByClassName("agree-text")[j].innerText == "▲ 已赞同 "){
            axios.post("/article/likeArticle",{ // 根据按钮的样式判断是否已赞
                userId : UserInfo.Id,
                articleId : articleIdArray[j],
                like : false,
            })
            .then(function(res){
                cancelLikeArticle(j);
            })
        }else{
            axios.post("/article/likeArticle",{
                userId : UserInfo.Id,
                articleId : articleIdArray[j],
                like : true,
            })
            .then(function(res){
                areadyLikeArticle(j);
            })
        }
    }

    // 已赞同函数
    function areadyLikeArticle(j){
        var agreeText = document.getElementsByClassName("agree-text")[j],
            agreeBtn = document.getElementsByClassName("agree")[j],
            disagreeBtn = document.getElementsByClassName("disagree")[j];

        agreeText.innerHTML = "▲ 已赞同 ";
        agreeBtn.className = "blue-button agree active";
        disagreeBtn.className = "blue-button disagree";

        console.log("文章" + j + "已赞同");
        getLikeNum(j);
    }

    // 取消赞同函数
    function cancelLikeArticle(j){
        var agreeBtn = document.getElementsByClassName("agree")[j],
            agreeText = document.getElementsByClassName("agree-text")[j];

        agreeText.innerHTML = "▲ 赞同 ";
        agreeBtn.className = "blue-button agree";

        console.log("文章" + j + "取消赞同");
        getLikeNum(j);
    }

    // 踩/取消踩
    function dislikeArticle(j){
        if( document.getElementsByClassName("disagree")[j].className == "blue-button disagree" ){
            axios.post("/article/dislikeArticle",{
                userId : UserInfo.Id,
                articleId : articleIdArray[j],
                dislike : true,
            })
            .then(function(res){
                areadyDislikeArticle(j);
            })
        }else{
            axios.post("/article/dislikeArticle",{
                userId : UserInfo.Id,
                articleId : articleIdArray[j],
                dislike : false,
            })
            .then(function(res){
                cancelDislikeArticle(j);
            })
        }

    }

    //已踩
    function areadyDislikeArticle(j){
        var agreeBtn1 = agreeBtn[j],
            agreeText1 = agreeText[j],
            disagreeBtn1 = disagreeBtn[j];

            agreeBtn1.className = "blue-button agree";
            agreeText1.innerHTML = "▲ 赞同 ";
            disagreeBtn1.className = "blue-button disagree active";
        
        getLikeNum(j);
        console.log("文章" + j + "已点踩");
    }

    // 取消踩
    function cancelDislikeArticle(j){
        var disagreeBtn1 = disagreeBtn[j];
            disagreeBtn1.className = "blue-button disagree";
            
        getLikeNum(j);
        console.log("文章" + j + "取消点踩");
    }

    // 获取点赞数量
    function getLikeNum(j){
        var agreeNum = document.getElementsByClassName("agree-num")[j];

        axios.get("/article/getArticles",{
            params : {
                userId : UserInfo.Id,
                start : j,
                stop : j,
            }
        })
        .then(function(res){
            console.log("文章" + j + "的点赞数为" + res.data.articles[0].likeNum);
            agreeNum.innerHTML = res.data.articles[0].likeNum;
        })
    }

//---------------------------------------------------

    var articleChild = document.getElementsByClassName("article-child");

    // 生成评论的整体结构
    function addCommentWrapper(i){
        var commentAll = document.createElement("div"),
            commentHead = document.createElement("div"),
            commentList = document.createElement("ul"),
            pagination = document.createElement("div"),
            writeComment = document.createElement("div"),
            commentInput = document.createElement("div"),
            commentInputChild = document.createElement("input"),
            submitBtn = document.createElement("button");

        commentAll.setAttribute("class","comment-all");
        commentHead.setAttribute("class","comment-head");
        commentList.setAttribute("class","comment-list");

        pagination.setAttribute("class","pagination");

        writeComment.setAttribute("class","write-comment");
        commentInput.setAttribute("class","comment-input");
        commentInputChild.setAttribute("placehodlder","写下你的评论...");
        commentInputChild.setAttribute("class","comment-input-child");
        submitBtn.setAttribute("class","blue-button submit-comment");
        submitBtn.innerHTML = "发布";

        writeComment.appendChild(commentInput);
        writeComment.appendChild(submitBtn);
        commentInput.appendChild(commentInputChild);

        commentAll.appendChild(commentHead);
        commentAll.appendChild(commentList);
        commentAll.appendChild(pagination);
        commentAll.appendChild(writeComment);

        var commentHeadChild = document.createElement("div"),
            commentHeadNum = document.createElement("span"),
            commentHeadText = document.createElement("span");

        commentHeadNum.setAttribute("class","comment-head-num");

        commentHeadText.innerHTML = " 条评论";

        commentHeadChild.appendChild(commentHeadNum);
        commentHeadChild.appendChild(commentHeadText);
        commentHead.appendChild(commentHeadChild);


        articleChild[i].appendChild(commentAll);
    }

    // 生成每一条评论
    function addEveryComment(i,j,avatar,nickname,time,content,likeNum){
        //创建元素
        var commentEveryLi = document.createElement("li"),
            infoDiv = document.createElement("div"),
            infoImg = document.createElement("img"),
            infoNickname = document.createElement("div"),
            comTime = document.createElement("div"),
            commentContent = document.createElement("div"),

            grayBtnList = document.createElement("div");

            commentEveryLi.setAttribute("class","comment-list-child"+i);
            infoDiv.setAttribute("class","info");
            infoImg.setAttribute("class","commentator-avatar");
            infoNickname.setAttribute("class","commentator-nickname");
            comTime.setAttribute("class","comment-time");
            commentContent.setAttribute("class","comment-content");
            grayBtnList.setAttribute("class","gray-btn-list");
            grayBtnList.setAttribute("id","com-gray-btn-list" + i + j);

        // 点赞按钮
        var likeComBtn = document.createElement("button"),
            iZan = document.createElement("i"),
            comLikeNum = document.createElement("span");

            likeComBtn.setAttribute("class","gray-button like-comment");
            likeComBtn.setAttribute("id","like-comment" + i + j);
            iZan.setAttribute("class","iconfont icon-zan");
            comLikeNum.setAttribute("class","comment-like-num");
            comLikeNum.setAttribute("id","comment-like-num" + i + j);

        // 点踩按钮
        var dislikeComBtn = document.createElement("button"),
            iCai = document.createElement("i");

            dislikeComBtn.setAttribute("class","gray-button dislike-comment");
            dislikeComBtn.setAttribute("id","dislike-comment" + i + j);
            iCai.setAttribute("class","iconfont icon-cai");

        // 查看回复按钮
        var openResBtn = document.createElement("button"),
            iRes = document.createElement("i"),
            resSpan = document.createElement("span");

            resSpan.innerHTML = "查看回复";
            openResBtn.setAttribute("class","gray-button open-respond");
            openResBtn.setAttribute("id","open-respond"+ i + j);
            iRes.setAttribute("class","iconfont icon-liaotianxinxi");

            openResBtn.onclick = function(){
                comRes.style.display = "block";
                document.documentElement.style.overflow = 'hidden';//隐藏滚动条
                submitRespond(i,j);

                // 生成回复界面的内容
                axios.get("/article/getComments",{
                    params:{
                        userId : UserInfo.Id,
                        articleId : articleIdArray[i],
                    }
                })
                .then(function(res){
                    console.log(res.data);
                    
                    var resComAvatar = document.getElementsByClassName("res-commentotar-avatar-child")[0],
                        resComNickname = document.getElementsByClassName("res-commentotar-nickname")[0],
                        resComtime = document.getElementsByClassName("res-commentotar-time")[0],
                        resComContent = document.getElementsByClassName("res-content-comment")[0];

                    resComAvatar.setAttribute("src",res.data.comments[j].avatar);
                    resComNickname.innerText = res.data.comments[j].nickname;
                    resComtime.innerText = new Date(res.data.comments[j].time).toLocaleDateString();
                    resComContent.innerText = res.data.comments[j].content;

                    if(res.data.comments[j].replied == true){   // 判断是否已经有人回复
                        // 获取回复
                        axios.get("/article/getReplies",{
                            params:{
                                userId : UserInfo.Id,
                                commentId : commentIdArray[i][j],
                            },
                        })
                        .then(function(res){
                            console.log(res.data);
                            
                            var resLength = res.data.replies.length,
                                commentRespondNum = document.getElementsByClassName("comment-respond-num")[0];

                                commentRespondNum.innerText = resLength;

                            for(var k = 0; k < resLength; k++){
                                var resTime = new Date(res.data.replies[k].time).toLocaleDateString();

                                addRespond(res.data.replies[k].avatar,res.data.replies[k].nickname,
                                    resTime,res.data.replies[k].content,res.data.replies[k].likeNum);

                                // 如果是当前用户的回复，添加删除按钮
                                if( res.data.replies[k].userId == UserInfo.Id){
                                    addDelResBtn(k);
                                    var myResNickname = document.getElementsByClassName("res-respondent-nickname")[k];
                                    myResNickname.innerText = myResNickname.innerText + " （自己）";
                                }
                                
                                likeOrDislikeRes(i,j,k);

                                respondIdArray.push(res.data.replies[k].replyId);
                            }
                            checkLikeOrDislikeRes(i,j);
                        })
                    }else{
                        //没有回复则进入
                        var commentRespondNum = document.getElementsByClassName("comment-respond-num")[0];
                        commentRespondNum.innerText = 0;

                        var noResLi = document.createElement("li");
                        noResLi.setAttribute("class","no-respond");
                        noResLi.innerText = "该评论暂时没有回复，快来发表你的想法吧！";

                        respondListUl.appendChild(noResLi);
                    }
                })
            }

        infoDiv.appendChild(infoImg);
        infoDiv.appendChild(infoNickname);
        infoDiv.appendChild(comTime);

        likeComBtn.appendChild(iZan);
        likeComBtn.appendChild(comLikeNum);
        dislikeComBtn.appendChild(iCai);
        openResBtn.appendChild(iRes);
        openResBtn.appendChild(resSpan);
        grayBtnList.appendChild(likeComBtn);
        grayBtnList.appendChild(dislikeComBtn);
        grayBtnList.appendChild(openResBtn);

        commentEveryLi.appendChild(infoDiv);
        commentEveryLi.appendChild(commentContent);
        commentEveryLi.appendChild(grayBtnList);

        commentListUl[i].appendChild(commentEveryLi);

        
        infoImg.setAttribute("src",avatar);
        infoNickname.innerText = nickname;
        comTime.innerText = time;
        commentContent.innerText = content;
        comLikeNum.innerText = likeNum;
        //点赞
        likeComBtn.onclick = function(){
            if( getStyle(likeComBtn,"color") == "rgb(0, 132, 255)"){
                likeComment(false,i,j,"gray-button like-comment","gray-button dislike-comment");
            }else{
                likeComment(true,i,j,"gray-button like-comment active","gray-button dislike-comment");
            }
        }

        // 点踩
        dislikeComBtn.onclick = function(){
            if( getStyle(dislikeComBtn,"color") == "rgb(0, 132, 255)" ){
                dislikeComment(false,i,j,"gray-button like-comment","gray-button dislike-comment");
            }else{
                dislikeComment(true,i,j,"gray-button like-comment","gray-button dislike-comment active");
            }
        }
    }

    // 获取后台评论 
    function getComments(i){
        axios.get("/article/getComments",{
            params : {
                userId : UserInfo.Id,
                articleId : articleIdArray[i],
            }
        })
        .then(function(res){
            console.log(res.data);
            var j = 0;
                for( j = 0; j < res.data.comments.length; j++){
                    var comTime = new Date(res.data.comments[j].time).toLocaleDateString();

                    addEveryComment(i,j,res.data.comments[j].avatar,res.data.comments[j].nickname,
                        comTime,res.data.comments[j].content,res.data.comments[j].likeNum);
                    commentIdArray[i].push(res.data.comments[j].commentId);

                    if( res.data.comments[j].userId == UserInfo.Id ){
                        //删除按钮
                        var delComBtn = document.createElement("button");
                        delComBtn.setAttribute("class","gray-button delete-comment");
                        delComBtn.innerHTML = "删除";
                        var grayBtnList = document.getElementById("com-gray-btn-list" + i + j);

                        grayBtnList.appendChild(delComBtn);
                    }
                }
                checkLikeOrDislikeComment(i);
        })
    }

    // 点赞或取消点赞评论
    function likeComment(bool,i,j,likeBtnClass,dislikeBtnClass){
        axios.post("/article/likeComment",{
                    userId : UserInfo.Id,
                    commentId : commentIdArray[i][j],
                    like : bool,
                })
                .then(function(res){
                    console.log(res.data);
                    updateComLikeNum(i,j);
                    likeCommentBtnStyle(likeBtnClass,i,j);
                    dislikeCommentBtnStyle(dislikeBtnClass,i,j);
                })
    }

    // 点踩或取消点踩评论
    function dislikeComment(bool,i,j,likeBtnClass,dislikeBtnClass){
        axios.post("/article/dislikeComment",{
                    userId : UserInfo.Id,
                    commentId : commentIdArray[i][j],
                    dislike : bool,
                })
                .then(function(res){
                    console.log(res.data);
                    updateComLikeNum(i,j);
                    likeCommentBtnStyle(likeBtnClass,i,j);
                    dislikeCommentBtnStyle(dislikeBtnClass,i,j);
                })
    }

    // 判断是否已经点赞或点踩评论
    function checkLikeOrDislikeComment(i){
        axios.get("/article/getComments",{
            params : {
                userId : UserInfo.Id,
                articleId : articleIdArray[i],
            }
        })
        .then(function(res){
            console.log(res.data);
            for(var j = 0; j < res.data.comments.length; j++){
                if(res.data.comments[j].liked == true){
                    likeCommentBtnStyle("gray-button like-comment active",i,j);
                }else{
                    likeCommentBtnStyle("gray-button like-comment",i,j);
                }

                if(res.data.comments[j].disliked == true){
                    dislikeCommentBtnStyle("gray-button dislike-comment active",i,j);
                }else{
                    dislikeCommentBtnStyle("gray-button dislike-comment",i,j);
                }
            }
        })
    }

    // 评论点赞按钮的样式
    function likeCommentBtnStyle(classStyle,i,j){
        var likeComBtn = document.getElementById("like-comment" + i + j);
        likeComBtn.setAttribute("class",classStyle);
    }

    // 评论点踩按钮的样式
    function dislikeCommentBtnStyle(classStyle,i,j){
        var likeComBtn = document.getElementById("dislike-comment" + i + j);
        likeComBtn.setAttribute("class",classStyle);
    }

    // 更新评论点赞数
    function updateComLikeNum(i,j){
        axios.get("/article/getComments",{
            params : {
                userId : UserInfo.Id,
                articleId : articleIdArray[i],
            }
        })
        .then(function(res){
            var commentLikeNum = document.getElementById("comment-like-num" + i + j);
            commentLikeNum.innerHTML = res.data.comments[j].likeNum;
            console.log(res.data);
        })
    }

    // 发布评论
    function submitComment(i){
        submitComBtn[i].onclick = function(){
            axios.post("/article/comment",{
                userId : UserInfo.Id,
                articleId : articleIdArray[i],
                content : comInput[i].value,
            })
            .then(function(res){
                console.log(res.data);
                location.reload();
            })
        }
    }

    // 根据评论数进行分页,每页评论至多十条
    function addPagingCommentElem(i,totalPageNum,comNum){
        var pagination = document.getElementsByClassName("pagination");

        var CommentListChild = document.getElementsByClassName("comment-list-child" + i);

        for(var page = 0; page < totalPageNum; page++){
            var pageNumBtn = document.createElement("button");
            if( page == 0 ){
                pageNumBtn.setAttribute("class","PaginationButton active");// 第一个分页按钮，初始化为该按钮激活
            }else{
                pageNumBtn.setAttribute("class","PaginationButton");
            }
            pageNumBtn.innerText = page + 1;
            pagination[i].appendChild(pageNumBtn);

            (function(page){
                pageNumBtn.onclick = function(){
                    for(var p = 0; p < comNum; p++){ // 先将所有评论隐藏
                        CommentListChild[p].style.display = "none";
                    }
                    var starPage = page*10, 
                        stopPage = page*10+10,
                        lastRemainder = comNum%10;  //评论最后一页的评论数
                    if( stopPage >= comNum){ //最后一页
                        stopPage = page*10+lastRemainder;
                    }

                    for(var p = starPage; p < stopPage; p++){
                        CommentListChild[p].style.display = "block";
                    }

                    var pageBtnList = document.getElementsByClassName("pagination")[i].getElementsByClassName("PaginationButton");
                    for(var p = 0; p < pageBtnList.length; p++){
                        pageBtnList[p].className = "PaginationButton";
                    }
                    pageBtnList[page].className = "PaginationButton active";
                }
            }(page));
        }

        if(comNum > 10){
            for(var p = 10; p < comNum;  p++){ //一开始展示的是第一页评论
                CommentListChild[p].style.display = "none";
            }
        }
    }

//---------------------------------------------------

    // 关闭回复界面
    var comRes = document.getElementsByClassName("comment-respond")[0],
        respondListUl = document.getElementsByClassName("respond-list")[0];

    // 点击回复界面外圈的黑色透明区域可关闭
    comRes.onclick = function(){
        comRes.style.display = "none";
    
        // 清空ul 的子节点
    　　clearChildNode(respondListUl);

        // 清空回复id数组
        respondIdArray.splice(0,respondIdArray.length);  

        // 打开竖向滚动条
        document.documentElement.style.overflow = 'auto';
    }

    var resContainer = document.getElementsByClassName("respond-container")[0];
    resContainer.onclick = function(e){
        stopBubble(e);
    }


    // 生成回复的结构
    function addRespond(avatar,nickname,time,content,resLikeNum){
       // 回复的第一行
        var resLi = document.createElement("li"),
            resHeadDiv = document.createElement("div"),
            resAvatarSpan = document.createElement("span"),
            resAvatarImg = document.createElement("img"),
            resNicknameSpan = document.createElement("span"),
            resTimeSpan = document.createElement("span");

        resLi.setAttribute("class","respond-list-child");
        resHeadDiv.setAttribute("class","respondent-head");

        resAvatarSpan.setAttribute("class","res-avatar res-respondent-avatar");
        resAvatarImg.setAttribute("class","res-respondent-avatar-child");
        resAvatarImg.setAttribute("src",avatar);

        resNicknameSpan.setAttribute("class","res-nickname res-respondent-nickname");
        resNicknameSpan.innerText = nickname;

        resTimeSpan.setAttribute("class","res-time res-respondent-time");
        resTimeSpan.innerText = time;

        resAvatarSpan.appendChild(resAvatarImg);
        resHeadDiv.appendChild(resAvatarSpan);
        resHeadDiv.appendChild(resNicknameSpan);
        resHeadDiv.appendChild(resTimeSpan);

        resLi.appendChild(resHeadDiv);

        // 回复的第二行
        var resContContainerDiv = document.createElement("div"),
            resContSpan = document.createElement("span");

        resContContainerDiv.setAttribute("class","res-content-container");
        resContSpan.setAttribute("class","res-content respondent-content");
        resContSpan.innerText = content;

        resContContainerDiv.appendChild(resContSpan);

        resLi.appendChild(resContContainerDiv);

        // 回复的第三行

        var grayBtnList = document.createElement("div"),
            likeResBtn = document.createElement("button"),
            zanI = document.createElement("i"),
            resLikeNumSpan = document.createElement("span"),
            dislikeResBtn = document.createElement("button"),
            caiI = document.createElement("i");

            grayBtnList.setAttribute("class","gray-btn-list");
            likeResBtn.setAttribute("class","gray-button like-respond");
            zanI.setAttribute("class","iconfont icon-zan");
            resLikeNumSpan.setAttribute("class","respond-like-num");
            resLikeNumSpan.innerText = resLikeNum;
            dislikeResBtn.setAttribute("class","gray-button dislike-respond");
            caiI.setAttribute("class","iconfont icon-cai");

            likeResBtn.appendChild(zanI);
            likeResBtn.appendChild(resLikeNumSpan);
            dislikeResBtn.appendChild(caiI);

            grayBtnList.appendChild(likeResBtn);
            grayBtnList.appendChild(dislikeResBtn);

            resLi.appendChild(grayBtnList);

            respondListUl.appendChild(resLi);
    }
    
    // 发表回复
    function submitRespond(i,j){
        var submitResBtn = document.getElementsByClassName("submit-respond")[0],
            resInput = document.getElementsByClassName("respond-input-child")[0];

        submitResBtn.onclick = function(){
            axios.post("/article/reply",{
                userId : UserInfo.Id,
                commentId : commentIdArray[i][j],
                content : resInput.value,
            })
            .then(function(res){
                console.log(res.data);
                alert("回复成功！");
            })
        }
    }

    // 添加删除回复的按钮
    function addDelResBtn(k){
        var delResBtn = document.createElement("button");
        delResBtn.setAttribute("class","gray-button delete-respond");
        delResBtn.innerText = "删除";

        var resGrayBtn = document.querySelectorAll(".respond-list-child .gray-btn-list")[k];
        resGrayBtn.appendChild(delResBtn);

        delResBtn.onclick = function(){
            axios.delete("/article/deleteReply",{
                data : {
                    userId : UserInfo.Id,
                    replyId : respondIdArray[k],
                }
            })
            .then(function(res){
                console.log(res.data);
                alert("删除回复成功");
            })
        }
    }

    // 点赞和点踩按钮添加事件
    function likeOrDislikeRes(i,j,k){
        var likeResBtn = document.querySelectorAll(".like-respond")[k],
            dislikeResBtn = document.querySelectorAll(".dislike-respond")[k];

        likeResBtn.onclick = function(){
            if( getStyle(likeResBtn,"color") == "rgb(0, 132, 255)" ){
                likeRespond(false,i,j,k,"gray-button like-respond",
                "gray-button dislike-respond");
            }else{
                likeRespond(true,i,j,k,"gray-button like-respond active",
                "gray-button dislike-respond");
            }
        }

        dislikeResBtn.onclick = function(){
            if( getStyle(dislikeResBtn,"color") == "rgb(0, 132, 255)" ){
                dislikeRespond(false,i,j,k,"gray-button like-respond",
                "gray-button dislike-respond");
            }else{
                dislikeRespond(true,i,j,k,"gray-button like-respond",
                "gray-button dislike-respond active");
            }
        }
    }

    // 点赞或取消点赞回复
    function likeRespond(bool,i,j,k,likeResClass,dislikeResClass){ // index值为true或false
        axios.post("/article/likeReply",{
                    userId : UserInfo.Id,
                    replyId : respondIdArray[k],
                    like : bool,
                })
                .then(function(res){
                    console.log(res.data);
                    updateResLikeNum(i,j,k);
                    likeRespondBtnStyle(likeResClass,k);
                    dislikeRespondBtnStyle(dislikeResClass,k);
                })
    }
    //点踩或取消点踩回复
    function dislikeRespond(bool,i,j,k,likeResClass,dislikeResClass){
        axios.post("/article/dislikeReply",{
                    userId : UserInfo.Id,
                    replyId : respondIdArray[k],
                    dislike : bool,
                })
                .then(function(res){
                    console.log(res.data);
                    updateResLikeNum(i,j,k);
                    likeRespondBtnStyle(likeResClass,k);
                    dislikeRespondBtnStyle(dislikeResClass,k);
                })
    }
    // 判断回复是否已经点赞或点踩
    function checkLikeOrDislikeRes(i,j){
        axios.get("/article/getReplies",{
            params:{
                userId : UserInfo.Id,
                commentId : commentIdArray[i][j],
            }
        })
        .then(function(res){ 
            console.log(res.data);
            for(var k = 0; k < res.data.replies.length; k++){
                if( res.data.replies[k].liked == true ){
                    likeRespondBtnStyle("gray-button like-respond active",k);
                }else{
                    likeRespondBtnStyle("gray-button like-respond",k);
                }

                if( res.data.replies[k].disliked == true ){
                    dislikeRespondBtnStyle("gray-button dislike-respond active",k);
                }else{
                    dislikeRespondBtnStyle("gray-button dislike-respond",k);
                }
            }
        })
    }

    // 回复点赞按钮样式
    function likeRespondBtnStyle(likeBtnClass,k){
        var likeResBtn = document.getElementsByClassName("like-respond")[k];
        likeResBtn.setAttribute("class",likeBtnClass);
    }

    // 回复点踩按钮样式
    function dislikeRespondBtnStyle(dislikeBtnClass,k){
        var dislikeResBtn = document.getElementsByClassName("dislike-respond")[k];
        dislikeResBtn.setAttribute("class",dislikeBtnClass);
    }

    // 更新回复点赞数
    function updateResLikeNum(i,j,k){
        axios.get("/article/getReplies",{
            params : {
                userId : UserInfo.Id,
                commentId : commentIdArray[i][j],
            }
        })
        .then(function(res){
            var resLikeNum = document.querySelectorAll(".respond-like-num")[k];
            resLikeNum.innerHTML = res.data.replies[k].likeNum;
        })
    }
//---------------------------------------------------

    