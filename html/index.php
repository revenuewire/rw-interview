<?php
@session_start();

//A fix for staging/production pre-write script name rule
$_SERVER['SCRIPT_NAME'] = 'index.php';
require_once __DIR__  . "/../src/bootstrap.php";

Application::init();
Application::$app->run();