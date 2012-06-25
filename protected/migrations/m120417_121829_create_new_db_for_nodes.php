<?php

class m120417_121829_create_new_db_for_nodes extends CDbMigration
{
	public function up()
	{
        $this->dropTable('rule');
        $this->dropTable('project');
        $this->dropTable('module_property');
        $this->dropTable('module');
        $this->dropTable('module_type');
        $this->dropTable('timeframe');
        $this->dropTable('unit');
        $this->execute('
              CREATE TABLE `mindmap` (
              `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
              `user_id` bigint(20) unsigned NOT NULL,
              `name` varchar(255) NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        ');

        $this->execute("
            CREATE TABLE `node_type` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `name` varchar(255) NOT NULL DEFAULT '',
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        ");

        $this->execute('
            CREATE TABLE `node` (
              `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
              `type` int(10) unsigned NOT NULL,
              `mindmap_id` bigint(20) unsigned NOT NULL,
              `title` varchar(255) NOT NULL,
              `description` varchar(500) DEFAULT NULL,
              `value` varchar(1000) DEFAULT NULL,
              `units` varchar(1000) DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `type` (`type`),
              KEY `mindmap` (`mindmap_id`),
              CONSTRAINT `mindmap` FOREIGN KEY (`mindmap_id`) REFERENCES `mindmap` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
              CONSTRAINT `type` FOREIGN KEY (`type`) REFERENCES `node_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        ');
	}

	public function down()
	{
        $this->dropTable('node');
        $this->dropTable('node_type');
        $this->dropTable('mindmap');
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