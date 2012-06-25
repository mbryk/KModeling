<?php

class m120417_145115_update_nodes_table extends CDbMigration
{
	public function up()
	{
		$this->execute(
			'ALTER TABLE `node`  
			ADD COLUMN `parent_id` bigint(20) DEFAULT NULL,
			ADD COLUMN `xpos` bigint(20) DEFAULT NULL,
			ADD COLUMN `ypos` bigint(20) DEFAULT NULL');
	}

	public function down()
	{
		$this->execute( 
			'ALTER TABLE `node`  
			DROP COLUMN `parent_id`,
			DROP COLUMN `xpos`,
			DROP COLUMN `ypos`');
	}
}