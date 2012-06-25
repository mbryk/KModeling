<?php

class NodeController extends RestController {

    public function init()
    {
        $this->modelClass = 'Node';
        parent::init();
    }

    public function actionList($id = null)
    {
        /** example return value * */
        /** one module with a related child * */
        $class = $this->modelClass;

        $models = $class::model()->findAllByAttributes(array('mindmap_id' => intval($id)));

        $this->sendResponse(200, CJSON::encode($models));
    }


}
