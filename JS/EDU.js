var parentRoot={};

/**
 * 小黄条
 */
parentRoot.hint=function () {
    if($.cookie('yellohint')==null){
        $('.bghint').css('display','block');
    }else{
        $('.bghint').css('display','none');
    }
    var clickhint=function () {
        $('.bghint').css('display','none');
        $.cookie('yellohint','1');
    }
    $('.bghint span').click(clickhint);
};

/**
 * 关注
 */
parentRoot.attention=function () {
    //判断是否关注
    var setattention=function () {
        if($.cookie('loginSuc')>0){
            if($.cookie('followSuc')>0){
                $('.cancel').css('display', 'block');
                $('.attention').css('display', 'none');
            }else{
                $('.cancel').css('display', 'none');
                $('.attention').css('display', 'block');
            }
        }else {
            $('.cancel').css('display', 'none');
            $('.attention').css('display', 'block');
        }

    };

    //添加取消关注事件
    $('#cancel_att').click(function(){
        $.cookie('followSuc',null);
        setattention();
    });

    setattention();
};

/**
 * 登录
 */
parentRoot.login=function () {
    //验证是否登录
    $(function () {
        parentRoot.attention();
    });
    //点击关注，判断是否登录，未登录进行登录
    $('.attention').click(function () {
        if($.cookie('loginSuc')>0){
            $.cookie('followSuc','1');
        }else{
            $('.bg-l').css('display','block');
        }
        parentRoot.attention();
    });

    //关闭登录
    $('.bg-l>div>i').click(function(){
        $('.bg-l').css('display','none');
    });

    //验证登录
    $('#loginBtn').click(function(){
        var name=md5($('#userName').val());
        var pass=md5($('#password').val());
        //自己手动写的完整URL（包括传递的参数）就不会报重定向错误
        var getlogin=$.get('http://study.163.com/webDev/login.htm'+'?userName='+
                name+'&password='+pass
        ).done(function(data){
            data=data.trim();
            if(data=='1'){
                $.cookie('loginSuc','1');
                $.cookie('followSuc','1');
                parentRoot.attention();
                $('.bg-l').css('display','none');
            }else{
                alert('登录失败！');
            }
        });
    });
};

/**
 * 轮播图
 */
parentRoot.carousel=function () {
    var interval;//定时器
    var next=1;//下一张
    var list=$('#list li');//获取图片列表
    var buttons=$('#buttons i');//获得小圆点列表
    var index=0;//当前值

    //页面加载完初始界面
    $(function () {
        //页面加载完自动轮播
        start();
        //鼠标移入轮播图，轮播暂停，移出录播继续
        $('#container').mouseout(start);
        $('#container').mouseover(end);
    });

    //开始轮播
    var start=function () {
        //图片每5秒更换一次
        //启动定时器
        interval=setInterval(go,5000);
    }

    //轮播中止
    var end=function () {
        //清除定时器，达到暂停轮播的效果
        clearInterval(interval);
    }

    //动画效果
    var go=function () {
        //一共三张图片循环，三次一个循环
        if(next>=3){
            next=next%3;
        }
        $(list[next]).animate({
            opacity:1,
            left:'0%'
        },500).css('zIndex',1);
        $(list[index]).delay(500).animate({
            opacity:0,
            left:'100%'
        },'fast').css('zIndex',0);
        $(buttons[index]).removeClass();
        index=next;
        $(buttons[index]).addClass('on');
        next++;
    }
};

/**
 * 课程详情
 *
 */
parentRoot.pageclass=function (apsize) {
     for(var i=0;i<apsize;i++){
         $('#checkdetail').append('<li><img width="223px" height="125px" >' +
             '<div class="detsmal"><p></p><span></span><br><i></i><br><strong></strong></div>' +
             '<div class="detbig"><img width="223px" height="125px">' +
             '<div class="dbleft">' +
             '<h3></h3><p class="people"><i></i><span></span></p>' +
             '<p class="author"><span></span></p>' +
             '<p class="sort"><span></span></p>' +
             '</div>' +
             '<p class="content"></p>' +
             '</div>' +
             '</li>');
     }
};

/**
 * 获取课程列表
 * page:当前页面
 * apsize:一页的课程个数
 * typeNow:课程类型
 */
parentRoot.getclass=function (page,apsize,typeNow) {
    var getDet=$.getJSON('http://study.163.com/webDev/couresByCategory.htm',{
        pageNo:page,
        psize:apsize,
        type:typeNow
    }).done(function(data){
        getDetail(data);
    });

    //给每个课程添加数据
    var getDetail=function (data) {
        var li=$('#checkdetail li');
        for (var i=0;i<li.length;i++){
            var indexli=$(li[i]);
            var indexdata=data.list[i];
            indexli.find('img').attr('src',indexdata.bigPhotoUrl);
            indexli.find('.detsmal i,.detbig .people i').text(indexdata.learnerCount);
            indexli.find('.detsmal span,.detbig h3').text(indexdata.name);
            indexli.find('.detsmal p,.detbig .content').text(indexdata.description);
            indexli.find('.detbig .author span').text('发布者：'+indexdata.provider);
            if(indexdata.price==0){
                indexli.find('.detsmal strong').text('免费课程').css('color','#080');
            }else{
                indexli.find('.detsmal strong').text('￥'+indexdata.price);
            }
            if(indexdata.categoryName==null){
                indexli.find('.detbig .sort span').text('分类：无');
            }else{
                indexli.find('.detbig .sort span').text('分类：'+indexdata.categoryName);
            }

        }
    }
};

/**
 * tab切换课程类型
 */
parentRoot.tabchange=function () {
    var clicktab=function (event) {
        $('#kind li').removeClass();
        var ele=event.target;
        $(ele).addClass('checktab');
        $('#page li').removeClass();
        $('#page li').first().addClass('checka');
        parentRoot.getclass('1','12',ele.id);
        parentRoot.nowpage=1;
    }
    $('#10').click(clicktab);
    $('#20').click(clicktab);
};


/**
 * 翻页器构建
 */
parentRoot.paging=function (page,size,ty) {
    var selectpage=function (page,size,ty) {
        $.getJSON('http://study.163.com/webDev/couresByCategory.htm',{
            pageNo: page,
            psize: size,
            type: ty
        }).done(function(data){
            //第一次时，拿到总页数，得到翻页器页数，构建翻页器
            addpage(data);
        });
    }
    var addpage=function (data) {
        $('#page').append('<i class="left"></i>');
        for(var i=1;i<=data.pagination.totlePageCount;i++){
            $('#page').append('<li>'+i+'</li>');
        }
        $('#page').append('<i class="right"></i>');
        $('#page li').first().addClass('checka');
    }
    selectpage(1,12,'10');
};


/**
 * nowpage:记录当前页面
 * 初始值为1
 */
parentRoot.nowpage=1;


/**
 * 点击页数跳转
 */
parentRoot.changepage=function(){
    var type=$('.checktab').attr('id');
    $('#page').on('click','li',function(){
        var page=$(this).text();
        var psize=12;
        $.getJSON('http://study.163.com/webDev/couresByCategory.htm',{
            pageNo: page,
            psize: 12,
            type: type
        }).done(function(data){
            if(page==data.pagination.totlePageCount){
                psize=data.totalCount-12*(page-1);
            }
            $('#checkdetail').empty();
            parentRoot.pageclass(psize);
        });
        parentRoot.getclass(page,psize,type);
        $('#page li').removeClass();
        $(this).addClass('checka');
        parentRoot.nowpage=page;
    });
};
/**
 * 左右翻页
 */
parentRoot.rlpage=function () {
    $('#page').on('click','i',function(){
        var max=$('#page li').last().text();
        var nowpage=parentRoot.nowpage;
        var nextpage;
        if($(this).hasClass('right')){
            nextpage=nowpage+1;
            if(nextpage>max){
                nextpage=nextpage%max;
            }
            nextpage--;//eq以0开始计数
            $('#page li').eq(nextpage).addClass('checka');
        }else{
            nextpage=nowpage-1;
            if(nextpage<1){
                nextpage=max;
            }
            nextpage--;//eq以0开始计数
            $('#page li').eq(nextpage).addClass('checka');
        }
        $('#page li').eq(nowpage-1).removeClass();
        changepageclass(nextpage);
        parentRoot.nowpage=nextpage+1;
    });
    //更新课程
    var changepageclass=function (nextpage) {
        var type=$('.checktab').attr('id');
        var psize=12;
        $.getJSON('http://study.163.com/webDev/couresByCategory.htm',{
            pageNo: nextpage+1,
            psize: 12,
            type: type
        }).done(function(data){
            if(nextpage+1==data.pagination.totlePageCount){
                psize=data.totalCount-12*(nextpage);
            }
            $('#checkdetail').empty();
            parentRoot.pageclass(psize);
        });
        parentRoot.getclass(nextpage+1,psize,type);
    };
};



/**
 * 视频弹窗
 */
parentRoot.videowin=function () {
    $('.bg-b i').click(function () {
        $('.bg-b').css('display','none');
        $('.bg-b video').currentTime=0;
    });
    $('.organ div').click(function () {
        $('.bg-b').css('display','block');
    });
};


/**
 * 最热排行构建
 * 一次显示十个
 */
parentRoot.hotclass=function () {
    for(var i=0;i<10;i++){
        $('#hot ul').append('<li>' +
            '<img width="50" height="50">' +
            '<div>' +
            '<p></p><i></i>' +
            '</div>' +
            '</li>');
    }
}

/**
 * 获取最热排行的课程
 */
parentRoot.gethot=function (hotnum) {
    var geth=$.getJSON('http://study.163.com/webDev/hotcouresByCategory.htm').done(function (data) {
        hot(data,hotnum);
    });
    var hot=function (data,hotnum) {
        var li=$('#hot ul li');
        for(var i=0;i<li.length;i++){
            var indexdata=data[i+hotnum];
            $(li[i]).find('img').attr('src',indexdata.smallPhotoUrl);
            $(li[i]).find('div i').text(indexdata.learnerCount);
            $(li[i]).find('div p').text(indexdata.name);
        }
    }
};

/**
 * 最热排行课程每5s更新一次
 * 刷新课程
 */
parentRoot.refclass=function () {
    var hotnum=0;
    var intervalHot;
    var starthot=function(){
        hotchange();
        intervalHot=setInterval(hotchange,5000);
    };
    var hotchange=function () {
        if(hotnum>=9){
            hotnum=0;
        }
        parentRoot.gethot(hotnum);
        hotnum++;
    }
    $(function () {
        starthot();
    });
}

/**
 * 悬停搜索图标变色
 */
parentRoot.search=function () {
    var searchli=$('.search li');
    for(var i=0;i<searchli.length;i++){
        $(searchli[i]).find('a').mouseover(function () {
           $('#search').css('backgroundPosition','0 -105px');
        });
        $(searchli[i]).find('a').mouseout(function () {
            $('#search').css('backgroundPosition','0 -79px');
        });
    }
}

//初始调用
$(function(){
    parentRoot.carousel();
    parentRoot.pageclass('12');
    parentRoot.getclass('1','12','10');
    parentRoot.hotclass();
    parentRoot.refclass();
    parentRoot.videowin();
    parentRoot.search();
    parentRoot.tabchange();
    parentRoot.hint();
    parentRoot.attention();
    parentRoot.login();
    parentRoot.paging(1,12,'10');
    parentRoot.changepage();
    parentRoot.rlpage();

});
