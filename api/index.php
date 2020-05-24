<?php
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $result = array();
    $result['success'] = true;
    if ($_POST['method'] == "list") {
        $result['success'] = false;

        $username = $_POST['username'];
        $password = $_POST['password'];
        $protocol = $_POST['protocol'];
        $ip = $_POST['ip'];
        $url = $protocol . "://" . $ip;

        $login = login($url, $username, $password);

        if ($login['success']) {
            $cookies = $login['cookies'];
            $response = listDownloads($url, $cookies);
            $result['tasks'] = $response['tasks'];
            $result['success'] = $response['success'];

            logout($url);
        } else {
            $result['success'] = false;
        }


    } else if ($_POST['method'] == "download") {
        $result['success'] = false;

        $username = $_POST['username'];
        $password = $_POST['password'];
        $protocol = $_POST['protocol'];
        $link = $_POST['link'];
        $ip = $_POST['ip'];
        $url = $protocol . "://" . $ip;
        $destination = null;

        $login = login($url, $username, $password);

        if ($login['success']) {
            $cookies = $login['cookies'];
            $result['success']  = download($url, $username, $password, $link, $destination, $cookies);

            logout($url);
        } else {
            $result['success'] = false;
        }

    } else if ($_POST['method'] == "delete") {
        $result['success'] = false;

        $username = $_POST['username'];
        $password = $_POST['password'];
        $protocol = $_POST['protocol'];
        $protocol = $_POST['protocol'];
        $id = $_POST['id'];
        $ip = $_POST['ip'];
        $url = $protocol . "://" . $ip;

        $login = login($url, $username, $password);

        if ($login['success']) {
            $cookies = $login['cookies'];
            $result['success'] = delete($url, $id, $cookies);

            logout($url);
        } else {
            $result['success'] = false;
        }



    } else if ($_POST['method'] == "pause") {
        $result['method'] = "pause";

    } else if ($_POST['method'] == "resume") {
        $result['method'] = "resume";

    } else if ($_POST['method'] == "status") {
        $error = false;

        $username = $_POST['username'];
        $password = $_POST['password'];
        $protocol = $_POST['protocol'];
        $ip = $_POST['ip'];
        $url = $protocol . "://" . $ip;

        $login = login($url, $username, $password);

        if ($login['success']) {

            if (logout($url)) {
                $result['success'] = true;
            } else {
                $result['success'] = false;
            }
        } else {
            $result['success'] = false;
        }

    }
    echo json_encode($result);

} else {
    $result = array("Erreur" => "Requete incorrecte");
    echo json_encode($result);
}



function login($url, $username, $password) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" . urlencode($username) . "&passwd=" . urlencode($password) . "&session=DownloadStation&format=cookie",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HEADER => 1
    ));

    $response = curl_exec($curl);
    preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $response, $matches);
    $cookies = array();
    foreach($matches[1] as $item) {
        parse_str($item, $cookie);
        $cookies = array_merge($cookies, $cookie);
    }
    $result = array("cookies" => $cookies);
    curl_close($curl);
    if (count($result['cookies']) > 0) {
        $result['success'] = true;
    } else {
        $result['success'] = false;
    }
    return $result;

}

function logout($url){
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&session=DownloadStation",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET"
    ));

    $response = json_decode(curl_exec($curl), true);

    curl_close($curl);
    return $response['success'];

}

function listDownloads($url, $cookies) {
    $curl = curl_init();

    $cookieText = "Cookie: smid=" . $cookies['smid'] . "; id=" . $cookies['id'];

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            $cookieText
        ),
    ));

    $response = curl_exec($curl);
    $response = json_decode($response, true);
    curl_close($curl);

    if ($response['success'] == false) {
        return array("success"=>false);
    } else {

        return array("success" => true, "tasks" => $response['data']['tasks']);
    }
}

function download($url, $username, $password, $downloadLink, $destination, $cookies) {

    $curl = curl_init();

    if (!is_null($destination)) {
        $destination = "&destination=" . $destination;
    }

    $cookieText = "Cookie: smid=" . $cookies['smid'] . "; id=" . $cookies['id'];

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=create&username=" . urlencode($username) . "&password=" . urlencode($password) . "&uri=" . $downloadLink . $destination,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            $cookieText
        ),
    ));

    $response = json_decode(curl_exec($curl), true);

    curl_close($curl);
    return $response['success'];

}

function delete($url, $id, $cookies) {
    $curl = curl_init();

    $cookieText = "Cookie: smid=" . $cookies['smid'] . "; id=" . $cookies['id'];

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=delete&id=" . $id,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            $cookieText
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return json_decode($response, true)['success'];
}