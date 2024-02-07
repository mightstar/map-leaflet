<?php

    // remove for production


    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    $executionStartTime = microtime(true);

    $url = 'http://secure.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=' . $_REQUEST['lat'] .'&lng='. $_REQUEST['lng'] .'&username=danieto&style=full';



   

    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result,true);    

    // if (isset($decode['geonames'])) {
    //     // 'geonames' key exists, proceed with your logic
    //     $output['data'] = $decode['geonames'];
    //     echo "Data found for 'geonames'";
    // } else {
    //     // 'geonames' key does not exist, handle the error
    //     $output['data'] = null;
    //     echo "No data found for 'geonames'";
    // }

 
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode['geonames'];


  

   

    header('Content-Type: application/json; charset=UTF-8');


    echo json_encode($output);

 




