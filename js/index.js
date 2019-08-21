// jQuery的window.onload写法
$(function () {
    // 获取顶部head的高度，因为鼠标滚出那个高度以后，就把下面的导航顶起来
    var topHeight = $('.header').height();

    // 鼠标悬浮在头像上时应显示用户信息
    // 这里的hover有 onmouseover 和onmouseout两个效果
    $('.header .user_logo').hover(function () {
        $('.user_info').show();
    }, function () {
        $('.user_info').hide();
    })

    $('.header .user_info').hover(function () {
        $(this).show();
    }, function () {
        $(this).hide();
    })

    // 鼠标滚动事件
    $(window).scroll(function () {
        // 实时监测，鼠标滚动的距离
        var sTop = $(document).scrollTop();

        // 只有当滚过的高度大于顶部header的高度的时候，才开始吸顶
        // 第二个条件只有没有1px的paddingTop的时候才执行，如果有的话表明执行过吸顶了
        if (sTop > topHeight && $('.nav').css('paddingTop') != '1px') {
            $('.nav').css({
                position: 'fixed',
                top: -60,
                paddingTop: 1,
                paddingBottom: 1
            }).animate({
                top: 0
            }, 500);

            // 吸顶后把右边的搜索框隐藏
            $('.nav .right').hide();

            // 然后把登录头像拿过来，复制一份，添加到刚才搜索框的位置
            $('.header').find('.right1').clone().appendTo('.nav .nav_box');

            // 当鼠标放在登录头像时弹出用户信息

            $('.nav .user_logo').hover(function () {
                $('.nav .user_info').show();
            }, function () {
                $('.nav .user_info').hide();
            });

            $('.nav .user_info').hover(function () {
                $(this).show();
            }, function () {
                $(this).hide();
            })
            // 如果滚动的距离小于顶部header的高度的时候，要开始还原
        } else if (sTop <= topHeight) {
            $('.nav').css({
                position: "absolute",
                top: topHeight,
                paddingTop: 0,
                paddingBottom: 0
            });

            // 复原搜索框
            $('.nav .nav_box').find('.right1').remove();
            $('.nav .right').show();
        }
    });

    // bg轮播图部分
    // 获取背景图
    var swiperImg = $('.bg_box .bg_ul1').children();

    // 获取小圆点
    var dot = $('.bg_box .bg_ul2').children();

    // 设置定时器，先初始化
    var timer = null;
    // 设置索引
    var index = 0;

    timer = setInterval(autoPlay, 2000);
    // 定义一个自动播放函数
    function autoPlay() {
        index++; // 准备显示下一张图
        if (index == dot.length) {
            index = 0; // 如果超出轮播图的总数，就显示第一张，重新开始
        }
        $(dot).eq(index).addClass('button-active').siblings().removeClass('button-active');

        // 控制图片轮播，若隐若现效果，淡入淡出
        $(swiperImg).eq(index).fadeIn(1500).siblings().fadeOut(1500);
    }

    // 鼠标移入移出，轮播图所在的大容器时，停止轮播，离开时，启动轮播
    $('.bg_box').mouseover(function () {
        clearInterval(timer);
    }).mouseout(function () {
        timer = setInterval(autoPlay, 2000);
    })

    // 鼠标点击小圆点，实现点击控制轮播
    $(dot).click(function () {
        // 显示小圆点对应的图片
        index = $(this).index() - 1;
        autoPlay();
    })

    // 热门商品切换页面按钮
    $('.shop_box > .title1 > .btn2').click(function () {
        $('.goods').animate({
            left: -1220 
        }, 500);
        $(this).addClass('disabled');
        $(this).siblings().removeClass('disabled');
    })
    $('.shop_box > .title1 > .btn1').click(function () {
        $('.goods').animate({
            left: 0
        }, 500);
        $(this).addClass('disabled');
        $(this).siblings().removeClass('disabled');
    })

    // 当鼠标移入热门商品时，显示红色商品信息和购买按钮
    $('.imgCart').hover(function () {
        $(this).find('.info_show').hide();
        $(this).find('.info_hide').show();
        $(this).find('.money').hide();
        $(this).find('.buy_btn').show();
    }, function() {
        $(this).find('.info_show').show();
        $(this).find('.info_hide').hide();
        $(this).find('.buy_btn').hide();
        $(this).find('.money').show();
    })

    // 点击商品的小圆点，使用ajax获取数据库里面对应的那个颜色的商品图片
    $('.imgCart').on('click', '.ck', function(e) {
        // 兼容ie
        var e = e || event;
        // 取消冒泡
        e.stopPropagation? e.stopPropagation(): e.cancelBubble = true;

        // 点击哪个小圆点就激活哪一个，其他的取消激活。
        $(this).addClass('btn-active').siblings().removeClass('btn-active');

        // 因为我们下面的代码可能会有循环，可能用到i和j，现在先声明并加_
        // 获取操作的图片商品的id
        var _i = $(this).attr('datai');
        // 小圆点在当前商品中的id
        var _j = $(this).attr('id');

        // 发送ajax获取热门商品分区的数据
        $.ajax({
            type: 'get',       // 因为获取的数据类型是json，只能用get方式
            url: 'http://www.demo.com/json/hotgoods.json',
            async: true,        // 异步开启
            dataType: 'json',   // 填了这个之后可以直接将获取到的json文件转换为对象
            timeout:10000,      // 超时时间，ajax的网络请求如果超过10s还没有收到后台传来的数据就停止
            success:function (data) {

                // 拿到数据后进行数据之间的匹配
                var arr = data[_i];
                console.log(arr);
                console.log(arr[_j]);   // 打印当前的的小圆点对应的那一张图片

                // 匹配对应的图片放到对应的盒子中
                $(this).parent().parent().children().eq(0).attr({
                    'src': arr[_j].img,
                    'width': 216,
                    'height': 216,
                    
                });

                // 获取对应的价格
                $(this).parent().parent().find('.money').html(arr[_j].price);
                $(this).parent().parent().children('img').attr('href', "http://www.demo.com/detail.html?spu="+arr[_j]["spu"]);
                console.log(arr[_j]["spu"]);
                console.log('获取到了');
            }.bind(this)        // 添加这个方法后，ajax里面的this会继承ajax外的this
        });

    });

    // 点击跳转到详情页面
    $('.a').click(function () {
        window.open($(this).attr('href'));
    })
})