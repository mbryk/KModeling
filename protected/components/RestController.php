<?php
class RestController extends Controller
{
    public function filters()
    {
        return array( 'accessControl' ); // perform access control for CRUD operations
    }

    public function accessRules()
    {
        return array(
            array('allow', 'users' => array('@')),
            array('deny')
        );
    }

    // @TODO: Tie demo db back when the time comes

    /** @var CActiveRecord|null */
    protected $modelClass = null;
    public function init()
    {
        parent::init();
        if($this->modelClass === NULL) {
            throw new CHttpException(500, 'Model class is not declared in '.get_called_class());
        }
    }

    protected function beforeAction($action)
    {
//        return $this->checkAuth();
        return parent::beforeAction($action);
    }


    public function  actionRead($id)
    {
        $class = $this->modelClass;
        $model = $class::model()->findByPk($id);

        $this->sendResponse(200, CJSON::encode($model));
    }

    public function actionList()
    {
        /** example return value * */
        /** one module with a related child * */
        $class = $this->modelClass;

        $models = $class::model()->findAll();

        $this->sendResponse(200, CJSON::encode($models));
    }

    public function actionCreate()
    {
        $class = $this->modelClass;
        $data = $this->getInputAsJson();


        $model = new $class();
        $model->setAttributes($data, false);


        if (!$model->save())
        {
           // $this->sendResponse(401);

            $errors = array();
            foreach ($model->getErrors() as $e)
                $errors = array_merge($errors, $e);
            throw new CException(implode("\n", $errors));
        }

        $this->sendResponse(200, CJSON::encode($model));
    }

    public function actionUpdate($id)
    {
        $class = $this->modelClass;
        $data = $this->getInputAsJson();

        $model = $class::model()->findByPk($id);
        if (!$model)
            $this->sendResponse(404);
        $model->setAttributes($data, false);


        if (!$model->save())
        {
            $this->sendResponse(401);
//            $errors = array();
//            foreach ($model->getErrors() as $e)
//                $errors = array_merge($errors, $e);
//            throw new CException(implode("\n", $errors));
        }

        $this->sendResponse(200);
    }

    public function actionDelete($id)
    {
        $class = $this->modelClass;
        $model = $class::model()->findByPk($id);
        if (!$model)
            $this->sendResponse(404);
        if (!$model->delete())
        {
            $this->sendResponse(401);

//            $errors = array();
//            foreach ($model->getErrors() as $e)
//                $errors = array_merge($errors, $e);
//            throw new CException(implode("\n", $errors));
        }

        $this->sendResponse(200);
    }
}