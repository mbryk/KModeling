<?php

class m120509_153240_update_table_node_type extends CDbMigration
{

    public function up()
    {
        $this->execute('DELETE FROM `node`');
        $this->execute('DELETE FROM `node_type`');

        $this->execute(
            'INSERT INTO `node_type` (`id`, `name`)
			 VALUES
				(1,"root"),
				(2,"sum"),
				(3,"calculate"),
				(4,"leaf")');

        $this->execute("
		   INSERT INTO `node` (`id`, `type`, `mindmap_id`, `title`, `description`, `value`, `units`, `parent_id`, `xpos`, `ypos`)
		     VALUES
			  (7, 1, 1, 'Root', 'Root node', NULL, NULL, NULL, 300, 300),
			  (8, 1, 1, 'Expense', 'Expense node', NULL, NULL, 7, 220, 420),
			  (9, 1, 1, 'Values', 'Values node', NULL, NULL, 7, 300, 180),
			  (10, 1, 1, 'Revenue', 'Revenue node', NULL, NULL, 7, 370, 420);");
    }

    public function down()
    {
        $this->execute('DELETE FROM `node`');
        $this->execute('DELETE FROM `node_type`');
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

}