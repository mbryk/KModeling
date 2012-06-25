<?php
class UnitController extends RestController
{
    public function init()
    {
        $this->modelClass = 'Unit';
        parent::init();
    }
}