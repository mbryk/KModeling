<?php

class m120329_142410_update_user_table extends CDbMigration
{

	public function safeUp()
	{
		/* now we will be able to save the color of the module */
		$this->addColumn('module', 'color', 'varchar(8)');
		/* supposed to be the first one */
		$this->insert('module_type', array('name'=>'root'));
	}

	public function safeDown()
	{
		/* remove root module */
		$this->delete('module_type', 'name=:name', array(':name'=>'root'));
		/* drop column root */
		$this->dropColumn('module', 'color');
		
	}
}