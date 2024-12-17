<?php 


    $servername = "localhost";
    $username = "superuser";
    $password = "heimer27";
    $db = "daytrade"; 
    $mysqli = null;
    $date = date("Y-m-d"); 

    // Check connection
    try {
        $mysqli = new mysqli($servername, $username, $password, $db);
    } catch (mysqli_sql_exception $e) {

    } 

    $result = $mysqli->query("select * from orders");

    $html = "<div><table style='border: 1px solid black !important;'><tbody>";

    if ($result->num_rows > 0) {


        $html .= "<tr><th>SYMBOL</th><th>ORDER STUB</th><th>ACTIONS</th><th>PRICE CHANGES</th></tr>"; 
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $html .=  "<tr style='font-size: 11px;'>";

            $html .= "<td style='border: 1px solid black !important; font-size: 15px !important; font-family: arial; '>" . $row["symbol"] . "</td>";
            $html .= "<td style='border: 1px solid black !important; width: 300px; font-size: 15px !important; font-family: arial; '>" . $row["order_stub"] . "</td>"; 
            $html .= "<td style='border: 1px solid black !important; width: 300px; font-size: 15px  !important; font-family: arial; '>" . preg_replace("/-- /", "--<br>", $row["volume_notes"])  . "</td>"; 
            $html .= "<td style='border: 1px solid black !important; width: 400px; font-size: 15px  !important; font-family: arial; '>" . preg_replace("/-- /", "--<br>", $row["individual_notes"]) . "</td>";
            $html .= "</tr>";
        }
    } else {
        $html = "<tr><td colspan = 4><span style='font-size: 15px>Nothing yet</span></</tr>";
    }

    $html .= "</tbody></table></div>";

    echo $html; 


?>




