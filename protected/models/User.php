<?php

/**
 * This is the model class for table "user".
 *
 * The followings are the available columns in table 'user':
 * @property integer $id
 * @property string $name
 * @property string $email
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password_hash
 * @property string $password_reset_token
 */
class User extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return User the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'user';
	}

	public function behaviors()
	{
		return array(
			'CTimestampBehavior' => array(
				'class' => 'zii.behaviors.CTimestampBehavior',
				'createAttribute' => 'created_at',
				'updateAttribute' => 'updated_at',
				'setUpdateOnCreate' => true,
			),
		);
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		return array(
			array('email, name', 'required'),
			array('email', 'unique'),
			array('password', 'safe', 'on' => 'insert'),
			array('email, name', 'length', 'max'=>255),

			// The following rule is used by search().
			array('id, created_at, updated_at, email, name', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'name' => 'Name',
			'email' => 'Email',
			'created_at' => 'Created At',
			'updated_at' => 'Updated At',
			'password_hash' => 'Password Hash',
			'password_reset_token' => 'Password Reset Token',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('created_at',$this->created_at);
		$criteria->compare('updated_at',$this->updated_at);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Sets new password
	 * @param string $password
	 */
	public function setPassword($password)
	{
		if(empty($password))
			return;

		$salt=substr(str_replace('+','.',base64_encode(sha1(microtime(true),true))),0,22);

		// 2a is the bcrypt algorithm selector, see http://php.net/crypt
		// 12 is the workload factor
		$this->password_hash=crypt($password,'$2a$12$'.$salt);
	}

	/**
	 * Checks if password supplied matches user password
	 *
	 * @param string $password
	 * @return bool
	 */
	public function checkPassword($password)
	{
		return $this->password_hash == crypt($password, $this->password_hash);
	}
}