<?php

class m120423_122048_update_initial_coords extends CDbMigration
{
	public function up()
	{
        $coordsForIds = array(7 => array('xpos' => 518, 'ypos' => 337),8 => array('xpos' => 615, 'ypos' => 393),9 => array('xpos' => 518, 'ypos' => 215),10 => array('xpos' => 421, 'ypos' => 393));

        foreach($coordsForIds as $id => $coords)
            $this->execute("
                UPDATE `node` set `xpos` = '{$coords['xpos']}', `ypos` = '{$coords['ypos']}' WHERE `id` = $id
            ");
	}

	public function down()
	{
		echo "m120423_122048_update_initial_coords does not support migration down.\n";
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