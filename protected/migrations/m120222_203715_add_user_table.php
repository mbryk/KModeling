<?php
class m120222_203715_add_user_table extends CDbMigration
{
	public function up()
	{
		$this->createTable('user', array(
			'id' => 'pk',

			'name' => 'string',
			'email' => 'string',

			'created_at' => 'integer',
			'updated_at' => 'integer',

			'password_hash' => 'char(60)',
			'password_reset_token' => 'string',
		), 'ENGINE=InnoDB DEFAULT CHARSET=utf8');
	}

	public function down()
	{
		$this->dropTable('user');
	}
}