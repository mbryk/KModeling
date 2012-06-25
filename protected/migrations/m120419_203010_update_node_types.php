<?php

class m120419_203010_update_node_types extends CDbMigration
{
	public function up()
	{
		$this->execute('UPDATE `node_type` SET name="valueRoot" WHERE id=5');
		$this->execute('INSERT INTO `node_type` (`id`,`name`) VALUES (8, "forkedValue")');
	}

	public function down()
	{
		$this->execute('UPDATE `node_type` SET name="value root" WHERE id=5');
		$this->execute('DELETE FROM `node_type` (`id`,`name`) VALUES (8, "forkedValue")');
	}

}