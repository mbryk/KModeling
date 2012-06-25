<?php

class m120418_130621_test_node_data extends CDbMigration
{
	public function up()
	{
        $this->execute("
            INSERT INTO `mindmap` (`id`, `user_id`, `name`)
              VALUES
                  (1, 0, 'demoMap');

        ");
        $this->execute("
            INSERT INTO `node_type` (`id`, `name`)
              VALUES
	              (1, 'split');

        ");
        $this->execute("
           INSERT INTO `node` (`id`, `type`, `mindmap_id`, `title`, `description`, `value`, `units`, `parent_id`, `xpos`, `ypos`)
             VALUES
                  (7, 1, 1, 'Root', 'Root node', NULL, NULL, NULL, 300, 300),
                  (8, 1, 1, 'Expense', 'Expense node', NULL, NULL, 7, 220, 420),
                  (9, 1, 1, 'Values', 'Values node', NULL, NULL, 7, 300, 180),
                  (10, 1, 1, 'Revenue', 'Revenue node', NULL, NULL, 7, 370, 420);

        ");

	}

	public function down()
	{
		echo "m120418_130621_test_node_data does not support migration down.\n";
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