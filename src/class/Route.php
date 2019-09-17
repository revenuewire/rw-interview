<?php

use Slim\App;

class Route
{
    /**
     * @param $app App
     */
    public static function initRoute($app)
    {
        $app->add(function($request, $response, $next) {
            $response = $next($request, $response);
            return $response->withHeader('Access-Control-Allow-Origin', '*')
                            ->withHeader('Access-Control-Allow-Headers', 'Content-Type')
                            ->withHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        });

        $app->options('/{routes:.+}', function ($request, $response, $args) {
            return $response;
        });

        $app->get('/ok', function ($request, $response, $args) {
            return $response->write("OK");
        });

        $app->get('/cars', function ($request, $response, $args) {
            $cars[] = array("id" => 4, "type" => "honda");
            $cars[] = array("id" => 2, "type" => "toyota");
            $cars[] = array("id" => 3, "type" => "jeep");
            return $response->withStatus(200)->write(json_encode($cars));
        });

	    $app->get('/car/{id}', function ($request, $response, $args) {
            $cars[4] = array("id" => 4, "type" => "honda");
            $cars[2] = array("id" => 2, "type" => "toyota");
            $cars[3] = array("id" => 3, "type" => "jeep");
            $id = $args["id"];
	        $details = array (
                "id" => $id,
                "headlights" => true,
                "seats" => strlen($cars[$id]["type"]),
                "interior_color" => "white",
                "transmission" => $id % 2 ? "automatic" : "standard"
            );
            return $response->withStatus(200)->write(json_encode($details));
        });

        $app->post('/car', function ($request, $response) {
            $parsedBody = $request->getParsedBody();
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'http://ix.io');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_USERPWD, "rw-test:rw-pass");
            curl_setopt($ch, CURLOPT_POSTFIELDS, "f:1=".json_encode($parsedBody));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $server_response = curl_exec($ch);
            curl_close ($ch);
            return $response->withStatus(200)->write($server_response);
        });

        $app->put('/car', function ($request, $response, $args) {
            $parsedBody = $request->getParsedBody();
            $ch = curl_init();
            $url = $request->getQueryParam('link');
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_USERPWD, "rw-test:rw-pass");
            curl_setopt($ch, CURLOPT_POSTFIELDS, "f:1=".json_encode($parsedBody));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $server_response = curl_exec($ch);
            curl_close ($ch);
            return $response->withStatus(200)->write($server_response);
        });

        $app->delete('/car', function ($request, $response, $args) {
            $ch = curl_init();
            $url = $request->getQueryParam('link');
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($ch, CURLOPT_USERPWD, "rw-test:rw-pass");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $server_response = curl_exec($ch);
            curl_close ($ch);
            return $response->withStatus(200)->write($server_response);
        });
    }
}
