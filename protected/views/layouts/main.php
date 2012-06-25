<!doctype html>
<!-- HTML5 shim, for IE6-8 support of HTML elements -->
<!-- adding IE detection -->
<!--[if lt IE 7 ]> <html class="ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8" lang="en"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html class="" lang="en"> <!--<![endif]-->
<meta charset="utf-8">
<meta name="language" content="en"/>
<meta name="csrf" content="<?php echo Yii::app()->request->getCsrfToken();?>" />
<title><?php echo CHtml::encode($this->pageTitle); ?></title>

<link rel="stylesheet" type="text/css"
      href="<?php echo Yii::app()->request->baseUrl; ?>/app_clean/css/formula-editor.css"/>
<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.8.20/themes/base/jquery-ui.css"/>
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/app_clean/css/all.css"/>
<link rel="stylesheet" type="text/css"
      href="<?php echo Yii::app()->request->baseUrl; ?>/app_clean/css/bootstrap-slate.css"/>
<link rel="stylesheet" type="text/css"
      href="<?php echo Yii::app()->request->baseUrl; ?>/app_clean/css/bootstrap-responsive.css"/>
<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/app_clean/css/new.css"/>

<!--	<script data-main="app_clean/js/main"-->
<!--			src="-->
<?php //echo Yii::app()->request->baseUrl; ?><!--/app_clean/js/libs/require/require.js"></script>-->

<!-- HTML5 shim, for IE6-8 support of HTML elements -->
<!--[if lt IE 9]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

</head>
<body>

<header class="header">
    <!-- here we are going to include the navigation bar -->
    <div class="main-menu">
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a>
                    <div id="loader" class="loading"></div>
                    <a class="brand" href="#/index">KModeling</a>
                    <div class="nav-collapse">
                        <div id="search"></div>
                        <div class="menu"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
<!-- layer to include sub-menus or other type of information -->
<div class="head container-fluid"></div>
<!-- main container -->
<div class="main container-fluid">
    <?php echo $content;?>
</div>
</body>
</html>
