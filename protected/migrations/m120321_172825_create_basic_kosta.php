<?php

class m120321_172825_create_basic_kosta extends CDbMigration
{
	public function safeUp()
	{
        $this->execute(
            'CREATE TABLE `module_type` (
              `id` bigint(20) NOT NULL AUTO_INCREMENT,
              `name` varchar(45) NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8'
        );


        $this->execute('
            CREATE TABLE `timeframe` (
              `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
              `name` varchar(45) NOT NULL,
              `value` bigint(20) NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');

        $this->execute('
            CREATE TABLE `unit` (
              `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
              `name` varchar(45) DEFAULT NULL,
              `module_id` bigint(20) DEFAULT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');

        $this->execute(
            'CREATE TABLE `module` (
              `id` bigint(20) NOT NULL AUTO_INCREMENT,
              `name` varchar(45) NOT NULL,
              `module_type_id` bigint(20) NOT NULL,
              `parent_id` bigint(20) DEFAULT NULL,
              `timeframe_id` smallint(5) unsigned DEFAULT NULL,
              `description` text,
              `xpos` bigint(20) DEFAULT NULL,
              `ypos` bigint(20) DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `module_type` (`module_type_id`),
              KEY `timefrm` (`timeframe_id`),
              CONSTRAINT `module_type` FOREIGN KEY (`module_type_id`) REFERENCES `module_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
              CONSTRAINT `timefrm` FOREIGN KEY (`timeframe_id`) REFERENCES `timeframe` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8'
        );

        $this->execute('
            CREATE TABLE `module_property` (
              `id` bigint(20) NOT NULL AUTO_INCREMENT,
              `module_id` bigint(20) NOT NULL,
              `name` varchar(45) NOT NULL,
              `value` float NOT NULL,
              `unit_id` bigint(20) unsigned DEFAULT NULL,
              `timeframe_id` smallint(5) unsigned DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `module_id` (`module_id`),
              KEY `module` (`module_id`),
              KEY `unit` (`unit_id`),
              KEY `timeframe` (`timeframe_id`),
              CONSTRAINT `timeframe` FOREIGN KEY (`timeframe_id`) REFERENCES `timeframe` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
              CONSTRAINT `module` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
              CONSTRAINT `unit` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');



        $this->execute('
            CREATE TABLE `project` (
              `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
              `userid` bigint(20) unsigned NOT NULL,
              `title` varchar(255) NOT NULL,
              `description` varchar(1000) DEFAULT NULL,
              `root_module` bigint(20) DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `root` (`root_module`),
              CONSTRAINT `root` FOREIGN KEY (`root_module`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');

        $this->execute("
            CREATE TABLE `rule` (
              `first_id` bigint(20) NOT NULL,
              `second_id` bigint(20) NOT NULL,
              `formula` varchar(100) NOT NULL,
              `type` enum('quantity, input') NOT NULL,
              PRIMARY KEY (`first_id`,`second_id`),
              KEY `first` (`first_id`),
              KEY `second` (`second_id`),
              CONSTRAINT `first` FOREIGN KEY (`first_id`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
              CONSTRAINT `second` FOREIGN KEY (`second_id`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ");






	}

	public function safeDown()
	{
        $this->dropTable('rule');
        $this->dropTable('project');
        $this->dropTable('module_property');
        $this->dropTable('module');
        $this->dropTable('module_type');
        $this->dropTable('timeframe');
        $this->dropTable('unit');

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