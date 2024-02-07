<?php

    // remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    $executionStartTime = microtime(true);



    $result = file_get_contents("../../countryBorders.geo.json");

    $decode = json_decode($result,true);

    $countryBorder = "";

    for ($i = 0; $i < count($decode['features']); $i++) {
   
        if($decode['features'][$i]['properties']['iso_a2'] == $_REQUEST['iso']){

            $countryBorder = $decode['features'][$i]['geometry'];
           
        }

    };

    
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countryBorder;


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

    




