<?php

class m120523_112922_alter_field_name extends CDbMigration
{
	public function up()
	{
        $this->execute('
            /* 3:34:15 PM  local */ ALTER TABLE `mindmap` DROP FOREIGN KEY `timeframeResUnits`;
            /* 3:27:51 PM  local */ ALTER TABLE `mindmap` CHANGE `timeResolutionUnits` `timeResolutionUnitsId` INT(11)  UNSIGNED  NULL  DEFAULT NULL;
            /* 3:28:33 PM  local */ ALTER TABLE `mindmap` ADD CONSTRAINT `timeResulutionUnits` FOREIGN KEY (`timeResolutionUnitsId`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
        ');
	}

	public function down()
	{
		echo "m120523_112922_alter_field_name does not support migration down.\n";
		return false;
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