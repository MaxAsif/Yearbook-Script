<?php
$myfile = fopen("mining_ug.txt", "w") or die("Unable to open file!");
$sql = "SELECT * FROM Sheet1 where (B='B.TECH' or B='5 YRS M.SC' or B='B.ARCH' or B='M.TECH DUAL') and E='MI'";
$capt = array("Look in the mirror, that's your competition", "Once you live in KGP, KGP lives in you", "Never go to a battle believing you'll lose","When the going gets tough the tough get going","KGP life is a complete package","Never Say Die","Came in as IITian going out as a proud KGPian","Journey's more beautiful than the destination","Better an Oops than a What If?","When life gives you lemons drink lemon chai at Tikka","Tempo se KGPian","Fear Binds You, Hope sets You Free","East or West, KGP is the best","Keep Calm and Conquer","I was't lucky, I deserved it","Welcome to my Autobiography","Make your Desires stronger than your fear","Success is the Sweetest Revenge","Life should be big and not long","Keep Calm and Live Life King Size");



$DB_NAME = 'yearbook';
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$connection = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($connection->connect_error) {
 // die("Connecton failed: ".$connection->connect_error);
   die("It seems that we cannot talk to our DB right now. Please try again in a couple of minutes");
} else {
//  echo "Connection Successful<br>";
}

$i=0;

$result = $connection->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
       // echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";


        $sql1 = "SELECT * FROM users where rollno='".$row["C"]."'";
        $result1 = $connection->query($sql1);
        if ($result1 ->num_rows > 0) {
    // output data of each row
            while($row1 = $result1->fetch_assoc()) {
                $hall=$row1["HOR"];
                if($row1["view_self"]=="")
                {
                    $caption=$capt[$i];
                    if($i>=19)
                        $i=0;
                    else
                        $i++;
                }
                else
                    $caption=$row1["view_self"];
            }
        } else {
            echo "0 results";
            $caption=$capt[$i];
            $i++;
            echo $i;
            $hall='-------';
        }


        if(empty($hall))
            $hall="-------";
       $caption = str_replace(array("\r", "\n"), '', $caption);
      $txt = $row["D"]."\n".$row["C"]."\n".$hall."\n".$row["H"]."\n".$caption."\n\n";

      fwrite($myfile, $txt);



  }
} else {
    echo "0 results";
}

$connection->close();

fclose($myfile);
?>