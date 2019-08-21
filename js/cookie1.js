// 设置cookie
    function setCookie(name, value, day) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + day);
        document.cookie = name + "=" + value + ";expires=" + oDate;
    }

    // 获取cookie
    function getCookie(name) {
        // 如果cookie中有数据 才可以获取数据，不这样判断的话shopcar里判断cookie的length属性会报错
        if(document.cookie) {
            var str = document.cookie;
            var arr = str.split("; ");      // cookie里的数据是用分号和空格分开的，所以用这俩进行分割
            // console.log("运行")
            for(var i = 0; i < arr.length; i++) {
                var arr1 = arr[i].split("=");
                if(arr1[0] == name) {
                    return JSON.parse(arr1[1])
                    // console.log(arr1[1]) ;
                    // console.log(JSON.parse(arr1[1]));
                    // console.log(typeof JSON.parse(arr1[1])); // 返回的是number类型
                }
            }
            // 如果cookie中没有想获取的键值，直接返回一个空数组
            return [];
        }
        // 如果cookie中没有数据，或者名字为name的cookie为undefined，直接返回一个空数组
        return [];
        
    }

    // 删除cookie
    function removeCookie(name) {
        setCookie(name, "", -1);
    }

    // 测试
    // setCookie("1", "1", 1);
    // getCookie("1");
    
