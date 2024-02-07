<?php


    // remove for production


    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    $executionStartTime = microtime(true);


    // $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country='. $_REQUEST['country'] . '&username=danieto';


    $url = 'https://secure.geonames.org/countryInfoJSON?formatted=true&country='. $_REQUEST['country'] . '&username=danieto';



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
    $output['data'] = $decode['geonames'];

   

    header('Content-Type: application/json; charset=UTF-8');


    echo json_encode($output);

 




