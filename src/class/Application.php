<?php

class Application
{
    public static $app;
    public static $container;

    /**
     * Init Container
     *
     * @return \Slim\Container
     */
    public static function initContainer()
    {
        self::$container = new \Slim\Container(); //Create Your container
        self::$container['settings']['displayErrorDetails'] = !(APPLICATION_ENV == Constants::SYSTEM_PRODUCTION);
        self::$container['settings']['determineRouteBeforeAppMiddleware'] = true;

        self::$container['appConfigs'] = function ($c) {
            $cacheKey = "my-app-configs";

            if (APPLICATION_ENV !== Constants::SYSTEM_LOCAL && apcu_exists($cacheKey)) {
                return apcu_fetch($cacheKey);
            }

            $data = \Symfony\Component\Yaml\Yaml::parse(file_get_contents(APP_ROOT . "/config.yaml"));
            if (!isset($data[APPLICATION_ENV])) {
                throw new InvalidArgumentException("No configs found for the environment.");
            }
            $config = $data[APPLICATION_ENV];
            apcu_store($cacheKey, $config);
            return $config;
        };

        self::$container['logger'] = function($c) {
            $logger = new \Monolog\Logger(self::$container['appConfigs']['application']['name']);
            $logger->pushHandler(new \Monolog\Handler\ErrorLogHandler());
            return $logger;
        };
        //Override the default Not Found Handler
        self::$container['notFoundHandler'] = function ($c) {
            return function ($request, $response) use ($c) {
                return $c['response']
                    ->withStatus(404)
                    ->withHeader('Access-Control-Allow-Origin','*')
                    ->withJson(array("message" => "Page Not Found"));
            };
        };

        self::$container['jwt'] = function ($c) {
            $appConfig = $c->get('appConfigs');

            /** @var $jwt RW\JWT\Token */
            $jwt = new \RW\JWT\Token();
            $jwt->setIssuer($appConfig['jwt']['issuer'])
                ->setExpiry($appConfig['jwt']['expiry']);

            if (!empty($appConfig['jwt']['secret'])) {
                $jwt->setSecret($appConfig['jwt']['secret']);
            } else {
                if (empty($appConfig['jwt']['kms'])) {
                    throw new \RW\Rest\Exception("kms-config-error", "KMS is not configured.");
                }
                $kms = new \RW\JWT\Helpers\KMS();
                $kms = $kms->setRegion($appConfig['jwt']['region'])
                            ->setAlias($appConfig['jwt']['alias'])
                            ->generateDataKey();
                $jwt->setAlg('KMS')
                    ->setKid($kms->getKid())
                    ->setSecret($kms->getPlaintext());
            }
            return $jwt;
        };

        self::$container['errorHandler'] = function ($c) {
            return function ($request, $response, $exception) use ($c) {
                /** @var $logger Monolog\Logger */
                $logger = $c->get('logger');

                if ($exception instanceof RestException) {
                    $contexts = $exception->getContext();
                    $contextsArr = array();
                    foreach ($contexts as $k => $v) {
                        $contextsArr[] = array(
                            "key" => $k, "value" => $v
                        );
                    }
                    $errors = array(
                        "code" => empty($exception->getCode()) ? 500 : $exception->getCode(),
                        "key" => $exception->getKey(),
                        "message" => $exception->getMessage(),
                        "context" => $contextsArr,
                    );
                    if (self::$container['settings']['displayErrorDetails']) {
                        $errors['exception'] = $exception->getMessage();
                    }
                    $logger->addWarning($exception, $contexts);
                    return $response->withStatus(500)
                        ->withHeader('Access-Control-Allow-Origin','*')
                        ->withJson($errors);
                }

                /** @var $route \Slim\Route */
                if ($exception instanceof InvalidArgumentException) {
                    $errors = array(
                        "code" => empty($exception->getCode()) ? 500 : $exception->getCode(),
                        "message" => $exception->getMessage()
                    );
                    if (self::$container['settings']['displayErrorDetails']) {
                        $errors['exception'] = $exception->getMessage();
                    }
                    $logger->addError($exception);
                    return $response->withStatus(500)
                        ->withHeader('Access-Control-Allow-Origin','*')
                        ->withJson($errors);
                }

                $logger->addCritical($exception);
                $responseData = array(
                    "code" => empty($exception->getCode()) ? 500 : $exception->getCode(),
                    "message" => "We are experiencing technical difficulties with your request. The developer team has been notified of this error.",
                );

                if (self::$container['settings']['displayErrorDetails']) {
                    $responseData['exception'] = $exception->getMessage();
                }
                return $response->withStatus(500)
                    ->withHeader('Access-Control-Allow-Origin','*')
                    ->withJson($responseData);
            };
        };

        self::$container['identity'] = function ($c) {
            /** @var $request \Psr\Http\Message\ServerRequestInterface */
            $request = $c['request'];

            $jwtToken = $request->getHeaderLine('X-Authorization-JWT');

            $identity = null;

            if (!empty($jwtToken)) {
                $jwt = \RW\JWT\Token::init($jwtToken);
                if ($jwt->getAlg() === "KMS"){
                    $jwt->setSecret(\RW\JWT\Helpers\KMS::decrypt($jwt->getKid()))
                        ->validate();
                } else {
                    /** @todo: can be removed after all token migrated to JWT 2.0 */
                    if (empty($c['appConfigs']['services'][$jwt->getIssuer()]['jwt'])) {
                        throw new \InvalidArgumentException("No JWT configuration for this issuer.");
                    }
                    $jwtConfig = $c['appConfigs']['services'][$jwt->getIssuer()]['jwt'];
                    if (!empty($jwtConfig['envSecret'])){
                        $secret = getenv($jwtConfig['envSecret']);
                    } else {
                        $secret = $jwtConfig['secret'];
                    }

                    $jwt = $jwt->setSecret($secret)->validate();
                }

                $payload = $jwt->getPayload();
                //return null iff self-identified as guest
                if (!empty($payload['identity']) && empty($payload['identity']['isGuest'])) {
                    $identity = $payload['identity'];
                }
                $identity['authType'] = 'jwt';

                return $identity;
            }

            return $identity;
        };

        return self::$container;
    }

    /**
     * Init App
     *
     * @return \Slim\App
     */
    public static function init()
    {
        self::initContainer();
        self::$app = new \Slim\App(self::$container);
        self::$app->add(new \Psr7Middlewares\Middleware\TrailingSlash(false));
        self::$app->add(new RKA\Middleware\IpAddress($checkProxyHeaders = true, $trustedProxies = array()));

        Route::initRoute(self::$app);

        return self::$app;
    }


}