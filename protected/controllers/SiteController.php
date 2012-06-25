<?php

class SiteController extends Controller
{
    public function filters()
    {
        return array('accessControl');
    }

    public function accessRules()
    {
        return array(
            array('deny',
            'actions' => array(
                'forgotPass', 'reset'
            ))
        );
    }

    public function actionisLogged()
    {

        $data['authenticated'] = !Yii::app()->user->getIsGuest();
        if($data['authenticated']) $data['username'] = Yii::app()->user->name;


        $this->sendResponse(200, CJSON::encode($data));
    }
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{

		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('index');
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
//        $crypt = new bCrypt();
//        $user = new User();
//        $user->name = 'admin';
//        $user->email = 'guyf@clevertech.biz';
//        $user->password_hash = $crypt->hash('GuyTonyRoman');
//        $user->save();die();
	    if($error=Yii::app()->errorHandler->error)
	    {
	    	if(Yii::app()->request->isAjaxRequest)
	    		echo $error['message'];
	    	else
	        	$this->render('error', $error);
	    }
	}

	public function actionLogin()
	{
		$data = $this->getInputAsJson();

//		// avoid for now
//		$token = RandHash::get();
//        if($data['username'] != $this->tempUsername || $data['password'] != $this->tempPassword) {
//            $error = 'Incorrect credentials';
//            $this->sendResponse(401, CJSON::encode($error));
//        }
//		$cookie = new CHttpCookie('_kmodeling', $data['username'].','.md5($data['username'].$data['password']));
//		$cookie->expire = time()+60*60*2;
//		//$cookie->secure = true;
//		Yii::app()->request->cookies['_kmodeling'] = $cookie;
//
//        $login = (object) array();
//		$login->authenticated = true;
//
//		$this->sendResponse(200, CJSON::encode($login));
//        die();
		// Authenticate user credentials
		$identity = new UserIdentity($data['username'], $data['password']);
		
		if ($identity->authenticate()) 
		{

            Yii::app()->user->login($identity);
//			$user = $identity->getUser();
//			$token = RandHash::get();
//			$value = implode(',', array($user->name, $token));
//
//			$cookie = new CHttpCookie('_kmodeling', $value);
//			$cookie->expire = time()+60*60*2;
//			$cookie->secure = true;
//			Yii::app()->request->cookies['_kmodeling'] = $cookie;
//
//			$command = Yii::app()->db->createCommand();
//			$command->insert('cookie', array(
//				'username'=> $user->username,
//				'token'=>$token,
//				'create_date' => new CDbExpression('NOW()'),
//			));
//
//			$login = (object) array();
//			$login->fname = $user->fname;
//			$login->lname = $user->lname;
//			$login->email = $user->email;
//			$login->username = $user->username;
//			$login->token = $token;
//			$login->authenticated = true;

			$this->sendResponse(200, CJSON::encode(array('authenticated' => true)));
		} 
		else {
			switch ($identity->errorCode) {
				case UserIdentity::ERROR_USERNAME_INVALID:
					$error = 'Incorrect username';
					break;
				case UserIdentity::ERROR_PASSWORD_INVALID:
					$error = 'Incorrect password';
					break;
				case UserIdentity::ERROR_USER_IS_DELETED:
					$error = 'This user is deleted';
					break;
			}

			$this->sendResponse(401, CJSON::encode($error));
		}
	}

	public function actionLogout() 
	{

//		if (!Yii::app()->u)
//            $this->sendResponse(401);
//
//		$data = CJSON::decode(file_get_contents('php://input'));
//
//		unset(Yii::app()->request->cookies['_kmodeling']);
//
//        $login = (object)array();
//        $login->authenticated = false;
        Yii::app()->user->logout();
        $this->sendResponse(200, CJSON::encode(array('authenticated'=>false)));

	}

	public function actionForgotpass()
	{

		$data = CJSON::decode(file_get_contents('php://input'));

		$user = User::model()->findByAttributes(array('name'=>$data['username']));

		if (!$user)
			$this->sendResponse(404, CJSON::encode('User not found.'));


		Yii::app()->mailer->IsSMTP();

		if ('private' == Yii::app()->params['env']) 
		{ 
			Yii::app()->mailer->Host = 'smtp.gmail.com';
			Yii::app()->mailer->SMTPAuth = true;     // turn on SMTP authentication
			Yii::app()->mailer->SMTPSecure = "tls";
			Yii::app()->mailer->Username = Yii::app()->params['smtp.username'];
			Yii::app()->mailer->Password = Yii::app()->params['smtp.password'];
			Yii::app()->mailer->From = 'test@kosta.local';
			Yii::app()->mailer->FromName = 'Scherago Loc';
		}
		else 
		{
			Yii::app()->mailer->Host = 'localhost';
			Yii::app()->mailer->From = 'test@scherago.int.clevertech.biz';
			Yii::app()->mailer->FromName = 'Scherago Int';
		}

		Yii::app()->mailer->AddAddress($user->email);
		Yii::app()->mailer->Subject = "Password Reset Confirmation";

		// Generate password token
		$pwResetToken = RandHash::get();
		$user->pw_reset_token = $pwResetToken;
		if (!$user->save()) {
			$errors = array();
			foreach ($user->getErrors() as $e) $errors = array_merge($errors, $e);
			throw new CException(implode("\n", $errors));
		}

		// Create the reset link
		$pwResetLink = Yii::app()->request->hostInfo . "/#preset/". urlencode(rawurlencode($pwResetToken));

		$body = "
Dear $user->fname $user->lname,
        
You are receiving this e-mail because you have requested to reset your password. 

To complete the password reset process, please follow this link: 
$pwResetLink 
        
Regards,
Scherago Admin
";
		Yii::app()->mailer->Body = $body;
		if ($return = Yii::app()->mailer->Send())
			$this->sendResponse(200, CJSON::encode($return));
		else
			$this->sendResponse(417, CJSON::encode($return));
	}
    /*
    // Remove asap
    // Temp
    public function actionReset() {

        Node::model()->deleteAll();
        Yii::app()->db->createCommand("
		   INSERT INTO `node` (`id`, `type`, `mindmap_id`, `title`, `description`, `value`, `units`, `parent_id`)
		     VALUES
			  (7, 1, 1, 'Root', 'Root node', NULL, NULL, NULL),
			  (8, 2, 1, 'Expense', 'Expense node', NULL, NULL, 7),
			  (9, 2, 1, 'Values', 'Values node', NULL, NULL, 7),
			  (10, 2, 1, 'Revenue', 'Revenue node', NULL, NULL, 7);")->execute();
        $this->redirect('/');
    }
    */
	public function actionPassreset() {
		$data = CJSON::decode(file_get_contents('php://input'));

		$pwResetToken = rawurldecode(urldecode($data['pw_reset_token']));
		$user = User::model()->findByAttributes(array('pw_reset_token'=>$pwResetToken));

		if (!$user)
			$this->sendResponse(404);

		$user->pw_reset_token = null;
		$user->newPassword = $data['password'];
		if ($user->newPassword)
			$user->password = $user->newPassword;
		if (!$user->save()) {
			$errors = array();
			foreach ($user->getErrors() as $e) $errors = array_merge($errors, $e);
			throw new CException(implode("\n", $errors));
		}

		$this->sendResponse(200);
	}
}
