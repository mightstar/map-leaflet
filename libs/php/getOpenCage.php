<?php

    // remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    $executionStartTime = microtime(true);


    // $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['q'] . "&countrycode=". $_REQUEST['q'] .'&key=54188f3902f3491ab9e33b74c0530a34';

    $url = 'https://api.opencagedata.com/geocode/v1/json?q=' . urlencode($_REQUEST['q']) . "&countrycode=" . $_REQUEST['countrycode'] . '&key=54188f3902f3491ab9e33b74c0530a34';

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result,true);    

 
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;


    header('Content-Type: application/json; charset=UTF-8');


    echo json_encode($output);

  

 

?>
