<?php 

 
        $s=dirname(__FILE__); //获的服务器路劲
        $time =time();        //获得当前时间戳
		$files1 =$_POST['files1'];
		$files2 =$_POST['files2'];
 
        $files = substr($files1,22);  

		 //解码
		 $tmp  = base64_decode($files);
		 $fp=$s."/uploads/".$time.".jpg";
		 //写文件
		 file_put_contents( $fp, $tmp);
		 echo 1;
		  
		  
		 if($files2 !=""){  
		 $filess =substr($files2,22);
		 //解码
		 $tmp2= base64_decode($filess);
		 $fp2=$s."/uploads/".$time."1".".jpg";

		 //写文件
		 file_put_contents( $fp2, $tmp2);
		  echo 2;
		 } 
 
   
         

?> 