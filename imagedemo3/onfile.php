<?php 

 
        $s=dirname(__FILE__); //��ķ�����·��
        $time =time();        //��õ�ǰʱ���
		$files1 =$_POST['files1'];
		$files2 =$_POST['files2'];
 
        $files = substr($files1,22);  

		 //����
		 $tmp  = base64_decode($files);
		 $fp=$s."/uploads/".$time.".jpg";
		 //д�ļ�
		 file_put_contents( $fp, $tmp);
		 echo 1;
		  
		  
		 if($files2 !=""){  
		 $filess =substr($files2,22);
		 //����
		 $tmp2= base64_decode($filess);
		 $fp2=$s."/uploads/".$time."1".".jpg";

		 //д�ļ�
		 file_put_contents( $fp2, $tmp2);
		  echo 2;
		 } 
 
   
         

?> 