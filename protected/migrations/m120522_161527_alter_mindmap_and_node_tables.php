<?php

class m120522_161527_alter_mindmap_and_node_tables extends CDbMigration
{
	public function up()
	{
        $this->execute("
            /* 7:56:05 PM  local */ ALTER TABLE `mindmap` ADD `timeframeUnitsId` INT  NULL  DEFAULT NULL  AFTER `name`;
            /* 7:56:14 PM  local */ ALTER TABLE `mindmap` ADD `timeframeLength` INT  NULL  DEFAULT NULL  AFTER `timeframeUnitsId`;
            /* 7:56:25 PM  local */ ALTER TABLE `mindmap` CHANGE `timeframeUnitsId` `timeframeUnitsId` INT(11)  UNSIGNED  NULL  DEFAULT NULL;
            /* 7:58:21 PM  local */ ALTER TABLE `mindmap` ADD `timeResolutionUnits` INT(11) UNSIGNED  NULL  DEFAULT NULL  AFTER `timeframeLength`;
            /* 7:59:11 PM  local */ ALTER TABLE `node` DROP `xpos`;
            /* 7:59:14 PM  local */ ALTER TABLE `node` DROP `ypos`;
            /* 7:59:52 PM  local */ ALTER TABLE `node` DROP `formula`;
        ");

        $this->execute("
                CREATE TABLE `units` (
                  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                  `unitType` enum('TIME') NOT NULL DEFAULT 'TIME',
                  `coefficient` float DEFAULT NULL,
                  `title` varchar(60) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`)
                ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
        ");
        $this->execute("
                INSERT INTO `units` (`id`, `unitType`, `coefficient`, `title`)
                    VALUES
                        (1, 'TIME', 1, 'day'),
                        (2, 'TIME', 7, 'week'),
                        (3, 'TIME', 30, 'month'),
                        (4, 'TIME', 365, 'year');
        ");
        $this->execute("
            /* 8:30:42 PM  local */ ALTER TABLE `mindmap` ADD CONSTRAINT `timeframeUnitsId` FOREIGN KEY (`timeframeUnitsId`) REFERENCES `units` (`id`);
            /* 8:30:42 PM  local */ ALTER TABLE `mindmap` ADD CONSTRAINT `timeframeResUnits` FOREIGN KEY (`timeResolutionUnits`) REFERENCES `units` (`id`);
        ");
	}

	public function down()
	{
		echo "m120522_161527_alter_mindmap_and_node_tables does not support migration down.\n";
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