<?php
// Set paths
$root = realpath(dirname(__FILE__) . '/../..');
$configRoot = dirname(__FILE__);
// Load params
$params = require($configRoot . '/params.php');
// Load local config
$configLocal = file_exists($configRoot . '/main-local.php') ? require($configRoot . '/main-local.php') : array();
// define a path alias
Yii::setPathOfAlias('root', $root);
Yii::setPathOfAlias('data', $root . '/protected/data');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return CMap::mergeArray(array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'KModeling App',
    'params' => $params,
    // preloading 'log' component
    'preload' => array('log'),

    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
        'application.helpers.*',
    ),

    'modules' => array(),

    // application components
    'components' => array(
        'user' => array(
            // enable cookie-based authentication
            'allowAutoLogin' => true,
            'loginUrl' => null

        ),
        'urlManager' => array(
            'urlFormat' => 'path',
            'rules' => array(
                // REST patterns for login
                array('site/login', 'pattern' => 'api/site/login', 'verb' => 'POST'),
                array('site/logout', 'pattern' => 'api/site/logout', 'verb' => 'POST'),
                array('site/forgotpass', 'pattern' => 'api/site/forgotpass', 'verb' => 'POST'),
                array('site/passreset', 'pattern' => 'api/site/passreset', 'verb' => 'POST'),


                // REST Controller Patterns
                array('<controller>/list', 'pattern' => 'api/<controller:(node|mindmap|unit)>s', 'verb' => 'GET'),
                array('<controller>/list', 'pattern' => 'api/<controller:(node|mindmap|unit)>s/<id:\d+>', 'verb' => 'GET'),
                array('<controller>/create', 'pattern' => 'api/<controller:(node|mindmap|unit)>', 'verb' => 'POST'),
                array('<controller>/read', 'pattern' => 'api/<controller:(node|mindmap|unit)>/<id:\d+>', 'verb' => 'GET'),
                array('<controller>/update', 'pattern' => 'api/<controller:(node|mindmap|unit)>/<id:\d+>', 'verb' => 'PUT'),
                array('<controller>/delete', 'pattern' => 'api/<controller:(node|mindmap|unit)>/<id:\d+>', 'verb' => 'DELETE'),

                // Other controllers
                '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
            ),
        ),
        'request' => array(
            'class' => 'HttpRequest',
            'enableCsrfValidation' => true,
        ),
        // MySQL database connection settings
        'db' => array(
            'connectionString' => "mysql:host={$params['db.host']};dbname={$params['db.name']}",
            'username' => $params['db.username'],
            'password' => $params['db.password'],
            'charset' => 'utf8',
            'enableParamLogging' => YII_DEBUG,
            'emulatePrepare' => true,
        ),
        'mailer' => array(
            'class' => 'application.extensions.mailer.EMailer',
        ),
        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'site/error',
        ),
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning',
                ),
            ),
        ),
    ),
), $configLocal);
