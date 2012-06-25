<?php
class MindmapController extends RestController
{
    public function init()
    {
        $this->modelClass = 'Mindmap';
        parent::init();
    }


    public function  actionRead($id)
    {
        $class = $this->modelClass;
        $model = $class::model()->findByAttributes(array('id' => $id, 'user_id' => Yii::app()->user->id));

        $this->sendResponse(200, CJSON::encode($model));
    }

    public function actionList()
    {
        /** example return value * */
        /** one module with a related child * */
        $class = $this->modelClass;

        $models = $class::model()->findAllByAttributes(array('user_id' => Yii::app()->user->id));

        $this->sendResponse(200, CJSON::encode($models));
    }

    public function actionCreate()
    {
        var_dump($data);
        $class = $this->modelClass;
        $data = $this->getInputAsJson();


        $model = new $class();
        $data['user_id'] = Yii::app()->user->id;
        $model->setAttributes($data, false);



        if (!$model->save())
        {
            $this->sendResponse(401);

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

        $model = $class::model()->findByAttributes(array('id' =>$id, 'user_id' => Yii::app()->user->id));
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
        $model = $class::model()->findByAttributes(array('id' =>$id, 'user_id' => Yii::app()->user->id));
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