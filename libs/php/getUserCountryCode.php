<?php

    // Enable error reporting for debugging (remove this in production)
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    $executionStartTime = microtime(true);
    
    // Construct the URL for the GeoNames API request
    $url = "http://api.geonames.org/countryCode?lat=" . $_GET['lat'] . "&lng=" . $_GET['lng'] . "&username=danieto";
    
    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    
    // Execute cURL session and store the result
    $result = curl_exec($ch);
    
    // Check if the cURL execution was successful
    if ($result === false) {
        // Error handling for cURL
        $output['status']['code'] = "400";
        $output['status']['name'] = "error";
        $output['status']['description'] = "cURL Error: " . curl_error($ch);
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit;
    }
    
    // Close cURL session
    curl_close($ch);
    
    // Format the response
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = trim($result); // Trimming to remove any extra whitespace
    
    // Set header and return the JSON response
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    
 