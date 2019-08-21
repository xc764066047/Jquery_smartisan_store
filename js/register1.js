$(function () {
    // 设置六位验证码，由大写字母和小写字母和数字组成,创建一个随机数函数来随机ASCII码，转换成数字字母后组合为验证码
    function rand(min, max) {
        return Math.round(Math.random() * (max - min) +min);
    }

    // 封装验证码生成函数
    function yzm () {
        var str = '';   // 存验证码用
        for (var i = 0; i < 6; i++) {
            var code = rand(48, 122);
            // 如果随机到字符的ascii码，应该重新随机
            if(code >= 58 && code <= 64 || code >= 91 && code <=96) {
                i--;
            } else {
                // 将数字变成字母
                var ch = String.fromCharCode(code);
                str += ch;
            }
        }
        return str;
    }
    // 当点击获取验证码
    $('#code').click(function () {
        // 点击一次后就不可再点击
        $(this).addClass('disabled');

        // 点击按钮后进行5s倒计时，时间到了方可再次点击，通过定时器来实现这个功能
        var time = 10;
        var timer = setInterval(function () {
            $('#code a').html(--time);
            if(time == 0) {
                clearInterval(timer);
                $('#code a').html(yzm());
            }
        }, 1000);
    });

    // 鼠标点击验证码输入框的时候，应该清空默认的文字
    $('#yzm').focus(function () {
        $(this).prev().html('');
    });

    // 当验证码框失去焦点的时候应该进行验证输入内容是否符合要求
    // blur()为失去焦点事件的方法
    $('#yzm').blur(function () {
        var iptCode = $('#yzm').val().trim();   // 输入的验证码，trim()为去除头尾空格的方法
        var getCode = $('#code a').html();      // 获取生成的验证码

        if (iptCode.length == 0) { // 用户没有输入验证码
            $(this).next().css({
                display: "inline",
                opacity: 1
            });
            console.log('没有输入验证码正常运行');
        } else if (iptCode != getCode) {    // 用户输入的验证码不匹配
            $(this).next().next().css({
                display: "inline",
                opacity:1
            });
            console.log('验证码错误正常运行');
        } else {
            //给出正确的提示
			$(this).next().css({
				display: "none",
				opacity: 0
			});

			$(this).next().next().css({
				display: "none",
				opacity: 0
			});
        }
    })


    // 失去表单焦点时，要对手机号码的格式进行验证
    $('#tel').blur(function () {
        // 获取输入的手机号码
        var tel = $(this).val().trim();

        // 设置手机号码格式
        var reg = /^1[345789]\d{9}$/;       // 意思是以数字1开头，第二位为345789中任意一个，后面9位为任意数字

        // 进行手机号码判断
        if (tel.length == 0) {
            $(this).next().css({
                display: "inline",
                opacity: 1
            });
            console.log('判断手机号码未输入功能正常');
        } else if (!reg.test(tel)) {
            $(this).next().next().css({
                display: "inline",
                opacity:1
            });
            console.log('判断手机号码格式错误功能正常');
        } else {
            // 从数据库里看手机号码是否已经被注册
            $.ajax({
                type: 'get',
                url: 'http://www.demo.com/php/login_register.php',
                data: {
                    status: 'checkTel',
                    tel:tel
                },
                async: true,
                timeout: 10000,
                success: function (msg) {
                    console.log(msg);
                    if (msg == 1) { // 如果从php中返回的echo值为1，代表已经被注册了
                        $(this).next().next().next().css({
                            display: 'inline',
                            opacity: 1
                        });
                        console.log('被注册');
                    } else {    // 如果返回的echo值为0，代表未被注册
                        $(this).next().css({
                            display: "none",
                            opacity: 0
                        }).next().css({
                            display: "none",
                            opacity: 0
                        }).next().css({
							display: "none",
							opacity: 0
						})
                    }
                }.bind(this)        // 让ajax里的this继承外面的this
            });
        }
    });

    // 密码验证
    // 焦点密码输入框时应清空文字
    $('#password').focus(function () {
        $(this).prev().html('');
    });
    //重复密码输入框同理
	$('#repassword').focus(function () {
		$(this).prev().html('');
    });
    // 查看两次密码是否相等验证
    $('#repassword').blur(function () {
        if ($('#password').val() != $('#repassword').val()) {
            alert('两次密码不一致！！！');
        }
    });

    // 注册逻辑
    $('#reg').click(function () {
        // 点击注册按钮时还应对所有输入框进行一次判定
        if (!$('#tel').val().trim() || $('#yzm').prev().html() == '短信验证码' || $('#password').prev().html() == '请输入密码' || $('#repassword').prev().html() == '请重复输入密码') {
            alert('请填完所有信息！！！');
        } else {
            var tel = $('#tel').val().trim();
            var pwd = $('#password').val().trim();
    
            $.ajax({
                type: "get",
                url: "http://www.demo.com/php/login_register.php",
                data: {
                    status: 'register',
                    tel: tel,
                    pwd: pwd
                },
                success: function (data) {
                    if (data == 1) {
                        alert('注册成功！');
                        setTimeout(function () {
                            location.href = "http://www.demo.com/login.html";
                        }, 3000);
                    }
                }
            });
        }
    });
})