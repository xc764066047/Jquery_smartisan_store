$(function () {
	//获取详情页的路径，因为里面有商品的id
	var str = location.href;
	var spu = str.split('=')[1];
	console.log(spu);

	$.ajax({
		type: 'get',
		url: 'http://www.demo.com/json/detail.json?id=' + Math.random, //保证这个链接每次都是新的，不会有缓存
		async: true,
		dataType: 'json',
		timeout: 10000,
		success: function (msg) {
			var item = msg[spu];
			console.log(item);
			//接下来就是挨个的替换网页中的数据,product
			$('#pro_img').attr('src', item.img);
			$('#pro_name').html(item.name);
			$('#pro_maizeng').html(item.maizeng);
			$('#pro_jiagou').html(item.jiagou);
			$('#pro_lingjuan').html(item.lingjuan);
			$('#pro_baoxiu').html(item.baoxiu);
			$('#pro_price').html(item.price);
			$('#pro_price1').html(item.price);

			for (var i = 0; i < item.yansen.length; i++) {
				$('.pro_baoxian1').eq(i).html(item.baoxian1[i]);
				$('.pro_baoxian2').eq(i).html(item.baoxian2[i]);
				$('.pro_yansen').eq(i).html(item.yansen[i]);
				if (i < item.yansen.length - 1) {
					$(".pro_rongliang").eq(i).html(item.rongliang[i]);
				}
			}

			// 给遮罩和图片放大框设置样式
			$('#mask').css({
				width: 312,
				height: 312,
				display: "none"
			});
			$('#big-img').attr({
				src: item.img,
				width: 800,
				height: 800
			});
			$('#big').css({
				left:950
			})
			// 大图要是可以移动，必须得使用绝对定位
			$('#big-img').css({
				position: "absolute",
				top: 0,
				left: 0
			});

			// 当鼠标移入小图时，遮罩和放大框应该隐藏
			$('#small').hover(function () {
				$('#mask').show();
				$('#big').show();
				// console.log('移入');
			}, function () {
				$('#mask').hide();
				$('#big').hide();
				// console.log('移出');
			});

			// 当鼠标在小图内移动时
			$('#small').mousemove(function (e) {
				var e = e || event;

				var x = e.pageX - $('#small').offset().left - $('#mask').width() / 2;
				var y = e.pageY - $('#small').offset().top - $('#mask').height() / 2;
				console.log(x);
				console.log(y);

				// 获取mask的最大left和top值
				var maxL = $('#small').width() - $('#mask').width();
				var maxT = $('#small').height() - $('#mask').height();

				// 若鼠标超出小图边缘，应该将遮罩的 x和y加以限制
				x = x < 0 ? 0 : (x > maxL ? maxL : x);
				y = y < 0 ? 0 : (y > maxT ? maxT : y);
				$('#mask').css({
					left: x,
					top: y
				});

				// 计算等比例的left和top值传入到大图框里
				var bigImgLeft = x * 800 / 500;
				var bigImgTop = y * 800 / 500;
				$('#big-img').css({
					left:-bigImgLeft,
					top:-bigImgTop
				});
			})
		}
	});


})