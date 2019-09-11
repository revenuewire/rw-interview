<?php

use Slim\App;

class Route
{
    /**
     * @param $app App
     */
    public static function initRoute($app)
    {
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
            $response->write(json_encode($cars));
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

            $response->write(json_encode($details));
        });
    }
}
