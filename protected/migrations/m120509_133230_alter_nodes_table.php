<?php

class m120509_133230_alter_nodes_table extends CDbMigration
{
	public function up()
	{
        $this->execute('
            ALTER TABLE `node` ADD `formula` VARCHAR(1000)  NULL  DEFAULT NULL  AFTER `ypos`;

        ');
	}

	public function down()
	{
		$this->execute('
            ALTER TABLE `node` DROP `formula`;

		');
	}

	/*
	// Use safeUp/safeDown to do migration with transaction
	public function safeUp()
	{
	}

	public function safeDown()
	{
	}
	*/
}