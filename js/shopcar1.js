$(function () {
    // 测试成功引用js
    // console.log('引用');

    // 声明一个立即执行函数让自定义插件在打开页面的时候就生效，且不会造成内存泄漏
    (function () {
        // 添加jQuery插件的方法
        $.extend({
            fnInit: function (startObj, endObj) { //确定三点坐标及抛物线方程的系数
                //起始点
                this.startPoint = {
                    x: startObj.offset().left + startObj.width() / 2,
                    y: startObj.offset().top
                }
                //结束点
                this.endPoint = {
                    x: endObj.offset().left + endObj.width() / 2,
                    y: endObj.offset().top
                }
                //最低(高)点
                this.topPoint = {
                    x: this.endPoint.x - 100,
                    y: this.endPoint.y + 80
                }
                //根据三点坐标  确定抛物线方程的系数
                this.a = ((this.startPoint.y - this.endPoint.y) * (this.startPoint.x - this.topPoint.x) - (this.startPoint.y - this.topPoint.y) * (this.startPoint.x - this.endPoint.x)) / ((this.startPoint.x * this.startPoint.x - this.endPoint.x * this.endPoint.x) * (this.startPoint.x - this.topPoint.x) - (this.startPoint.x * this.startPoint.x - this.topPoint.x * this.topPoint.x) * (this.startPoint.x - this.endPoint.x));
    
                this.b = ((this.endPoint.y - this.startPoint.y) - this.a * (this.endPoint.x * this.endPoint.x - this.startPoint.x * this.startPoint.x)) / (this.endPoint.x - this.startPoint.x);
    
                this.c = this.startPoint.y - this.a * this.startPoint.x * this.startPoint.x - this.b * this.startPoint.x;
                return this;
            },
            fnMove: function (src) { //抛物线的运动
                //创建图片
                var $img = $("<img>");
                //将图片添加到body中
                $("body").append($img);
                //设置img的src为 当前按钮对应的图片的src值
                $img.attr("src", src);
    
                //获取商品的起始点
                var x = this.startPoint.x;
                var y = this.startPoint.y;
    
                //描述商品的样式  重点是定位
                $img.css({
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 30,
                    height: 30,
                    borderRadius: "50%"
                })
                //商品开始运动
                var timer = setInterval(function () {
                    x = x + 10;
                    y = this.a * x * x + this.b * x + this.c;
                    if (x < this.endPoint.x) {
                        $img.css({
                            left: x,
                            top: y
                        })
                    } else {
                        clearInterval(timer);
                        $img.remove();
                        //改变购物车中的商品数量
                        $("#shopNum").html(parseInt($("#shopNum").html()) + 1);
                    }
                }.bind(this), 10)
            }
        });


        // 点击购买按钮。会有图片以抛物线的形式发送到购物车按钮里面去
        $('.shoping').click(function (e) {
            // 阻止冒泡
            var e = e || event;
            e.stopPropagation? e.stopPropagation(): e.cancelBubble = true;

            var startObj = $(this);     // 抛物线起点
            var endObj = $('.sp');      // 抛物线重点

            var $imgObj = $(this).parents('.imgCart').find('img');
            // console.log($imgObj);    // 获取成功

            // 获取大图的src
            var src = $imgObj.attr('src').split('?')[0];
            // console.log(src);   // 成功获取大图的引用地址

            // 调用上面封装的抛物线插件
            $.fnInit(startObj, endObj).fnMove(src);

            // console.log($(this));
            setGoodsCookie($(this));
        });

        function setGoodsCookie(obj) {
            var arr = [];
            var json = [];

            // http://www.demo.com/detail.html?spu=100051701
            var spu = obj.parents('.imgCart').find('img').attr('href').split('=')[1];
            console.log(spu);   // 成功获取到了商品编号

            var flag = true;

            $.ajax({
                type: 'get',
                url: '../json/detail.json',
                dataType: "json",
                success: function (msg) {
                    var pro = msg[spu];
                    console.log(pro);
                    // 组装成json数据
                    json = {
                        "id": spu,
                        "name": pro.name,
                        "src": pro.img.split('?')[0],
                        "price": pro.price,
                        "count": 1
                    }

                    // 把购物车页面的数据取出来，合并到cookie里
                    var brr = getCookie("shoplist");
                    console.log(brr);
                    // 如果购物车里已经有商品了
                    if(brr.length !=0) {
                        arr = brr;
                        for (var i =0; i <arr.length; i++) {
                            // 如果已经存在了这个商品，总数++
                            if(json.id == arr[i].id) {
                                arr[i].count++;
                                flag =false; //已经操作过了，循环可以结束
                                break;
                            }
                        }
                    }

                    if(flag) {
                        arr.push(json);
                    }

                    // JSON.stringify 把json对象格式化成json字符串
                    setCookie("shoplist", JSON.stringify(arr));
                    console.log(document.cookie);
                }
            });
        }

        // 购物车页面逻辑实现
        // cookie里面提取出来购物车信息
        var brr = getCookie('shoplist');
        var conStr = "";

        // console.log(brr);
        for (var i = 0; i < brr.length; i ++) {
            var shopinfo = brr[i];      // 把brr里的每一项都取出来方便后面操作
            var price = shopinfo.price.split(".")[0].replace(",", "");
            console.log(price);

            // 购物车的html内容
            conStr += '<div class="shop-item clearfix">' +
			'<p class="fl"><input type="checkbox" class="ck"/></p>' +
			'<img class="fl" src="' + shopinfo.src + '" alt="" />' +
			'<p class="fl">' + shopinfo.name + '</p>' +
			'<span class="fl">' + shopinfo.price + '元</span>' +
			'<p class="fl count" ' +
			'data-id="' + shopinfo.id + '" ' +
			'data-price="' + shopinfo.price + '" data-count="' + shopinfo.count + '"' +
			'data-name="' + shopinfo.name + '" data-src="' + shopinfo.src + '"' +
			'>' +
			'<span class="updateCount" data-number="1">+</span>' +
			'<span class="shop-count"  contenteditable="true">' + shopinfo.count + '</span>' +
			'<span class="updateCount" data-number="-1">-</span>' +
			'</p>' +
			'<em class="fl sumPrice">' + (shopinfo.count * price) + '元</em>' +
			'<i class="fl delBtn">删除</i>' +
			'</div>';
        }

        $('.shoplist').html(conStr);
        getCount();         // 获取商品的数量

        // 封装获取商品数量的函数
        function getCount() {
            // 根据cookie来获取商品数量
            var brr = getCookie('shoplist');
            var count = 0;
            if (brr.length != 0) {
                for (var i = 0; i < brr.length; i ++) {
                    count += brr[i].count;
                }
            }
            // 将商品数量插入到对应的元素内
            $('#shopNum').html(count);
        }

        // 全选功能
        $('#selectAll').click(function () {
            $('.ck').prop('checked', $(this).prop('checked'));
            // console.log(typeof $(this).prop('checked'));
            jiesuan();
            // console.log("点击");
        })

        // 单选复选框应该结算
        $('.ck').click(function () {
            jiesuan();
        });

        // 如果购物车每一行都被勾选，则勾选全选
        // 添加一个change监听器
        $('.ck').change(function () {
            // 获取到复选框的数量
            var allCheckbox = $('.ck').length;
            // 获取勾选的复选框的数量
            var trueCheckbox = $('.ck:checked').length;
            // console.log(allCheckbox);
            // console.log(trueCheckbox);

            // 如果相等了，就勾选全选复选框
            var isAllChecked = allCheckbox === trueCheckbox;
            $('#selectAll').prop('checked', isAllChecked);

        })

        // 手动修改商品数量
        $('.shop-count').keyup(function () {
            var count = parseInt($(this).html());
            var id = $(this).parent().data('id');

            if(count > 0) {
                // 遍历cookie里的每一个商品id，找到对应的那个商品
                for (var i = 0; i <brr.length; i++) {
                    if(id == brr[i].id) {       // 如果购物车内商品的id和cookie里的id相等
                        // 就将cookie里对应id的商品的数量修改为当前元素节点内的数量
                        brr[i].count = count;
                        setCookie('shoplist', JSON.stringify(brr));

                        // 手动修改商品数量后应该修改总价
                        $(this).parent().next().html(brr[i].count * brr[i].price.split('.')[0].replace(',', '') + '元');
                        jiesuan();
                        break;
                    }
                }
            }
        });


        // 删除商品逻辑

        $('.delBtn').click(function () {
            // confirm()是带确定和取消按钮的警告框，确定返回true，取消返回false
            if (confirm('确认将该商品移出购物车？？？')) {
                var id = $(this).parent().find('.count').data('id');

                // 遍历cookie里的每一个商品id，找到对应的那个商品
                for (var i = 0; i < brr.length; i++) {
                    if (id == brr[i].id) {
                        // 找到对应的id的商品编号后，就从cookie里删除
                        brr.splice(i, 1);
                        // 然后重新设置cookie
                        setCookie('shoplist', JSON.stringify(brr));

                        // 然后更新购物车列表和总价
                        $(this).parent().remove();
                        jiesuan();
                        // 结束循环
                        break;
                    }
                }
            }
        });

        // 加减操作
        $('.updateCount').click(function () {
            // 获取当前操作的商品编号
            var id = $(this).parent().data('id');

            // 获取一下运算符，看是+1还是-1
            var sign = $(this).data('number');
            console.log(sign);

            // 获取到数量内容
            var count = $(this).parent().find('.shop-count').html();

            // 如果商品数量本身只有一件了，那么点击减按钮就失效
            if (sign == -1 && count == 1) {
                return;
            }

            // 通过循环找到商品对应id来修改商品数量和cookie
            for (var i = 0;i < brr.length; i ++) {
                if(id == brr[i].id) {
                    // 如果找到了对应id的商品cookie，就修改它的数量
                    brr[i].count += sign;
                    // 再设置到cookie里去
                    setCookie('shoplist', JSON.stringify(brr));

                    // 更新当前页面的数据
                    //修改页面中的数据.当前这条的数据
                    $(this).parent().find('.shop-count').html(brr[i].count);
                    $(this).parent().next().html(brr[i].count * brr[i].price.split(".")[0].replace(',', '') + '元');
                    jiesuan();
                    break;
                }
            }
        })
        


        // 结算函数
        function jiesuan() {
            var count = 0;
            var money = 0;
            $('.ck:checked').each(function () {
                count += parseInt($(this).parent().parent().find('.shop-count').html());
                money += parseInt($(this).parent().parent().find('.sumPrice').html());
            });

            // 把数量和总价传入到对应的元素节点内
            $('.count2').html(count);
            $('.money2').html(money);
        }

    })()
})