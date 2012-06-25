<?php

class m120524_121816_add_admin_user extends CDbMigration
{
	public function up()
	{
        $this->execute("
        INSERT INTO `user` (`id`, `name`, `email`, `created_at`, `updated_at`, `password_hash`, `password_reset_token`)
          VALUES
        (1, 'admin', 'guyf@clevertech.biz', 1337860475, 1337860475, '$2a$08$1cuuV8xVf/RiV1tCJkAE/O7JLnpG7GvaaUWjNrkMm0VM4vuubcExa', NULL);

      ");
	}

	public function down()
	{
		echo "m120524_121816_add_admin_user does not support migration down.\n";
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