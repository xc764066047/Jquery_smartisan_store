<?php
//php连接数据库的一个步骤
	header("content-type:text/html;charset=utf-8");	//设置页面的字符集
	$db = mysql_connect("localhost","root","123456"); //设置数据库的密码，自己设置的密码
	// var_dump($db);
	mysql_select_db("smartsian",$db);	//选择数据库
	mysql_query("set names utf8");	//设置数据库的字符集，如果不统一就会乱码
?>