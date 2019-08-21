$(function () {

    // 先获取到输入的帐号和密码
    var tel = $('#tel').val().trim();
    var pwd = null;
    var tel = null;
    // 帐号验证函数
    function yz() {
        // 声明手机和邮箱的正则表达式变量
        var reg1 = /^1[345789]\d{9}$/;
        var reg2 = /[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/;

        console.log(tel);

        // 在手机号码输入框失去焦点时进行手机号码判断
        $('#tel').blur(function () {
            tel = $('#tel').val().trim();
            if (tel.length == 0) {
                $('#tel').next().css({
                    display: "inline",
                    opacity: 1
                });
                console.log(tel);
            } else if (!reg1.test(tel) && !reg2.test(tel)) {
                $('#tel').next().next().css({
                    display: "inline",
                    opacity: 1
                });
            } else {
                // 从数据库里看手机号码是否已经被注册
                $.ajax({
                    type: 'get',
                    url: 'http://www.demo.com/php/login_register.php',
                    data: {
                        status: 'checkTel',
                        tel: tel
                    },
                    async: true,
                    timeout: 10000,
                    success: function (msg) {
                        console.log(msg);
                        if (msg == 1) { // 如果从php中返回的echo值为1，代表已经被注册了
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
                            console.log('被注册');
                        } else { // 如果返回的echo值为0，代表未被注册
                            
                            $(this).next().next().next().css({
                                display: 'inline',
                                opacity: 1
                            });
                        }
                    }.bind(this) // 让ajax里的this继承外面的this
                });
            }
        });
    }

    yz();

    // 密码验证函数
    function mmyz () {
        $('#log > a').click(function () {
            pwd = $('#password').val().trim();
            $.ajax({
                type: 'get',
                url: 'http://www.demo.com/php/login_register.php',
                async: true, //异步
                data: {
                    status: 'login',
                    tel: tel,
                    pwd: pwd
                },
                success: function (msg) {
                    console.log(msg);
                    if (msg == 1) {
                        alert('登录成功！');
                        window.location.href = "http://www.demo.com";
                        console.log(msg + '密码正确的php返回值');
                    } else if (msg == 2) {
                        console.log(msg + '密码错误的php返回值');
                        alert('密码错误');
                    } else {
                        console.log(msg + '没被注册的php返回值');
                        alert('手机号码没有注册');
                    }
                }
            });
        })
    }
    
    mmyz();
})