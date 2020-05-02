
    var homeIndex = document.querySelector(".Home");

    var articleIdArray = []; // 文章ID数组

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

    // 判断是否已经生成文章，防止退出-重新登录后又生成一遍
    var articleFlags = false;

    // 检查登录状态
    function checkLogin(){
        axios.get("http://47.97.204.234:3000/user/state")
        .then(function(res){
            console.log(res.data);
            if(res.data.result == "success"){
                myId = res.data.userId;
                signIn.style.display = "none"
                // homeIndex.style.display = "block";
                headFixed.style.display = "block";

                outFriends(myId);
                getUserInfo();
                if( articleFlags == false){
                    articleFlags = true;
                    getArticle();
                }
            }else{
                myId = 0;
            }
        })
    }

    // 获取用户的信息
    function getUserInfo(){
        if(myId != 0){
            axios.get("http://47.97.204.234:3000/user/getInfo",{
                params:{
                    userId : myId,
                }
            })
            .then(function(res){
                headAvatarImg.setAttribute("src",res.data.info.avatar);
                nowUsername = res.data.info.nickname;
                nowPassword = "123";

                console.log("获取用户信息成功");
            })
            .catch(function(error){
                console.log(error);
            })
        }
    }

    checkLogin();

    // 获取文章
    function getArticle(){
        axios.get("http://47.97.204.234:3000/article/getArticles",{
            params:{
                userId : myId,
                start : 0,
                stop : 18,
            }
        })
        .then(function(res){
            for(var i = 0; i < 19; i++){
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
                            articleAll.innerHTML = "收起 ^";
                        }else{
                            articleContent.style.whiteSpace = "nowrap";
                            articleContent.style.textOverflow = "ellipsis";
                            articleAll.innerHTML = "阅读全文 ∨";
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

                    //生成评论
                    var comLength = res.data.articles[i].commentNum;

                    addCommentInArticle(i);

                    for(var k = 0; k < comLength; k++){
                        commentListUl[i].appendChild( addEveryComment(i,k) ) ;
                    }

                    if(comHeadNum[i]){
                        comHeadNum[i].innerHTML = res.data.articles[i].commentNum;
                    }

                    // 打开评论按钮
                    openComBtn[i].onclick = function(){
                        if( getStyle((oneComment[i]),"display") == "none"){
                            oneComment[i].style.display = "block";
                        }else{
                            oneComment[i].style.display = "none";
                        }
                    }

                    // 提交评论按钮
                    submitComBtn[i].onclick = function(){
                        axios.post("http://47.97.204.234:3000/article/comment",{
                            userId : myId,
                            articleId : articleIdArray[i],
                            content : comInput[i].value,
                        })
                        .then(function(res){
                            console.log(res.data);
                        })
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

        var spanGrayBtn = document.createElement("span"), // 灰色各类按钮
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

        divBtn.appendChild(spanBlueBtn);
        divBtn.appendChild(spanGrayBtn);

        return divBtn;
    }
// ----------------------------------------

    // （取消）赞同函数
    function likeArticle(j){
        if(document.getElementsByClassName("agree-text")[j].innerText == "▲ 已赞同 "){
            axios.post("http://47.97.204.234:3000/article/likeArticle",{
                userId : myId,
                articleId : articleIdArray[j],
                like : false,
            })
            .then(function(res){
                cancelLikeArticle(j);
            })
        }else{
            axios.post("http://47.97.204.234:3000/article/likeArticle",{
                userId : myId,
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
            axios.post("http://47.97.204.234:3000/article/dislikeArticle",{
                userId : myId,
                articleId : articleIdArray[j],
                dislike : true,
            })
            .then(function(res){
                areadyDislikeArticle(j);
            })
        }else{
            axios.post("http://47.97.204.234:3000/article/dislikeArticle",{
                userId : myId,
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

        axios.get("http://47.97.204.234:3000/article/getArticles",{
            params : {
                userId : myId,
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

    // 关于每条评论的各个元素，头像、昵称、内容、评论点赞数.
    var commentatorAvatar = document.getElementsByClassName("commentator-avatar"),
        commentatorNickname = document.getElementsByClassName("commentator-nickname"),
        commentContent = document.getElementsByClassName("comment-content"),
        commentLikeNum = document.getElementsByClassName("comment-like-num");

    var articleChild = document.getElementsByClassName("article-child");

    // 生成评论的整体框架
    function addCommentInArticle(j){
        var commentAll = document.createElement("div"),
            commentHead = document.createElement("div"),
            commentList = document.createElement("ul"),
            commentHeadChild = document.createElement("div"),
            commentHeadNum = document.createElement("span"),
            commentHeadText = document.createElement("span"),
            writeComment = document.createElement("div"),
            commentInput = document.createElement("div"),
            commentInputChild = document.createElement("input"),
            submitBtn = document.createElement("button");

        commentAll.setAttribute("class","comment-all");
        commentHead.setAttribute("class","comment-head");
        commentList.setAttribute("class","comment-list");
        commentHeadNum.setAttribute("class","comment-head-num");

        writeComment.setAttribute("class","write-comment");
        commentInput.setAttribute("class","comment-input");
        commentInputChild.setAttribute("placehodlder","写下你的评论...");
        commentInputChild.setAttribute("class","comment-input-child");
        submitBtn.setAttribute("class","blue-button submit-comment");

        commentHeadText.innerHTML = " 条评论";
        submitBtn.innerHTML = "发布";

        commentHeadChild.appendChild(commentHeadNum);
        commentHeadChild.appendChild(commentHeadText);
        commentHead.appendChild(commentHeadChild);

        writeComment.appendChild(commentInput);
        writeComment.appendChild(submitBtn);
        commentInput.appendChild(commentInputChild);

        commentAll.appendChild(commentHead);
        commentAll.appendChild(commentList);
        commentAll.appendChild(writeComment);

        articleChild[j].appendChild(commentAll);
    }

    // 生成每一条评论
    function addEveryComment(i,j){
        var commentEveryLi = document.createElement("li"),
            infoDiv = document.createElement("div"),
            infoImg = document.createElement("img"),
            infoNickname = document.createElement("div"),
            commentContent = document.createElement("div"),

            grayBtnList = document.createElement("div"),

            likeComBtn = document.createElement("button"),
            iZan = document.createElement("i"),
            comLikeNum = document.createElement("span"),

            dislikeComBtn = document.createElement("button"),
            iCai = document.createElement("i"),

            openResBtn = document.createElement("button"),
            iRes = document.createElement("i"),
            resSpan = document.createElement("span");

            infoDiv.setAttribute("class","info");
            infoImg.setAttribute("class","commentator-avatar");
            infoNickname.setAttribute("class","commentator-nickname");

            commentContent.setAttribute("class","comment-content");

            grayBtnList.setAttribute("class","gray-btn-list");
            likeComBtn.setAttribute("class","gray-button like-num");
            iZan.setAttribute("class","iconfont icon-zan");
            comLikeNum.setAttribute("class","comment-like-num");
            dislikeComBtn.setAttribute("class","gray-button dislike-comment");
            openResBtn.setAttribute("class","gray-button");
            iRes.setAttribute("class","iconfont icon-liaotianxinxi");
            iCai.setAttribute("class","iconfont icon-cai");

        resSpan.innerHTML = "查看回复";

        axios.get("http://47.97.204.234:3000/article/getComments",{
            params : {
                userId : myId,
                articleId : articleIdArray[i],
            }
        })
        .then(function(res){
            console.log(res.data);
            infoImg.setAttribute("sec",res.data.comments[j].avatar);
            infoNickname.innerHTML = res.data.comments[j].nickname;
            commentContent.innerHTML = res.data.comments[j].content;
            comLikeNum.innerHTML = res.data.comments[j].likeNum;
        })
        .catch(function(error){
            console.log(error);
        })

        infoDiv.appendChild(infoImg);
        infoDiv.appendChild(infoNickname);

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

        return commentEveryLi;
    }

    //发布评论
    var submitComBtn = document.getElementsByClassName("submit-comment"),
        comInput = document.getElementsByClassName("comment-input-child");
    
//---------------------------------------------------
    // 测试用 
    var testBtn = document.querySelector(".home-right .blue-button");

    testBtn.onclick = function(){
        addCommentInArticle(0,0);
    }