<?php
define('APP_ROOT', realpath(dirname(__FILE__)));

defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'local'));

date_default_timezone_set( 'UTC' );

require APP_ROOT . '/../vendor/autoload.php';
