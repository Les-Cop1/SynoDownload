<?php
header("Access-Control-Allow-Origin: *");
if (isset($_GET['method']) && $_SERVER['REQUEST_METHOD'] == "GET") {
    $result = array();
    $result['success'] = true;
    if ($_GET['method'] == "list") {
        $result['method'] = "list";
        $result['success'] = false;

        $username = $_GET['username'];
        $password = $_GET['password'];
        $protocol = $_GET['protocol'];
        $ip = $_GET['ip'];
        $url = $protocol . "://" . $ip;

        if (login($url, $username, $password)) {

            $result['tasks'] = listDownloads($url);

            logout($url);
        } else {
            $result['success'] = false;
        }


    } else if ($_GET['method'] == "download") {
        $result['success'] = false;

        $username = $_GET['username'];
        $password = $_GET['password'];
        $protocol = $_GET['protocol'];
        $link = $_GET['link'];
        $ip = $_GET['ip'];
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

    } else if ($_GET['method'] == "delete") {
        $result['method'] = "delete";

    } else if ($_GET['method'] == "pause") {
        $result['method'] = "pause";

    } else if ($_GET['method'] == "resume") {
        $result['method'] = "resume";

    } else if ($_GET['method'] == "status") {
        $error = false;

        $username = $_GET['username'];
        $password = $_GET['password'];
        $protocol = $_GET['protocol'];
        $ip = $_GET['ip'];
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
        CURLOPT_URL => $url . "/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account=" . $username . "&passwd=" . $password . "&session=DownloadStation&format=cookie",
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

function listDownloads($url) {
    $curl = curl_init();

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
            "Cookie: smid=DC_fjk7JTDu4KC8WwBYzpu62SbOA4nJcW-Ejmh60twut_PhKBbIApXy7fsXxQ9RKhtpQrHgkt-NQdu0kEaDn9A; id=sjKu5fX1oPFqs18B0Q8N652500"
        ),
    ));

    $response = json_decode(curl_exec($curl), true);
    var_dump($response);
    curl_close($curl);
    if ($response['success'] == false) {
        return array();
    } else {
        return $response['tasks'];
    }
}

function download($url, $username, $password, $downloadLink, $destination, $cookies) {

    $curl = curl_init();

    if (!is_null($destination)) {
        $destination = "&destination=" . $destination;
    }

    $cookieText = "Cookie: smid=" . $cookies['smid'] . "; id=" . $cookies['id'];

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url . "/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=create&username=" . $username . "&password=" . $password . "&uri=" . $downloadLink . $destination,
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