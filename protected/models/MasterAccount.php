<?php

/**
 * This is the model class for table "master_account".
 *
 * The followings are the available columns in table 'master_account':
 * @property integer $account_id
 * @property integer $is_active
 * @property string $company_name
 * @property string $creation_date
 * @property integer $year_founded
 * @property string $industry
 * @property string $business_type
 * @property string $website
 * @property integer $revenue3
 * @property integer $revenue2
 * @property integer $revenue1
 * @property string $software_accounting
 * @property string $software_crm
 * @property string $why_started
 * @property string $enjoy_most
 * @property string $enjoy_least
 * @property string $challenge
 * @property string $vision_verb1
 * @property string $vision_verb2
 * @property string $vision_what
 * @property string $vision_whom
 * @property string $vision_scale
 *
 * The followings are the available model relations:
 * @property MasterBuild[] $masterBuilds
 */
class MasterAccount extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return MasterAccount the static model class
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
		return 'master_account';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('account_id', 'required'),
			array('account_id, is_active, year_founded, revenue3, revenue2, revenue1', 'numerical', 'integerOnly'=>true),
			array('company_name, industry, website', 'length', 'max'=>255),
			array('business_type, vision_what, vision_whom', 'length', 'max'=>45),
			array('software_accounting, software_crm', 'length', 'max'=>100),
			array('vision_verb1', 'length', 'max'=>5),
			array('vision_verb2', 'length', 'max'=>4),
			array('vision_scale', 'length', 'max'=>8),
			array('creation_date, why_started, enjoy_most, enjoy_least, challenge', 'safe'),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('account_id, is_active, company_name, creation_date, year_founded, industry, business_type, website, revenue3, revenue2, revenue1, software_accounting, software_crm, why_started, enjoy_most, enjoy_least, challenge, vision_verb1, vision_verb2, vision_what, vision_whom, vision_scale', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'masterBuilds' => array(self::HAS_MANY, 'MasterBuild', 'account_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'account_id' => 'Account',
			'is_active' => 'Is Active',
			'company_name' => 'Company Name',
			'creation_date' => 'Creation Date',
			'year_founded' => 'Year Founded',
			'industry' => 'Industry',
			'business_type' => 'Business Type',
			'website' => 'Website',
			'revenue3' => 'Revenue3',
			'revenue2' => 'Revenue2',
			'revenue1' => 'Revenue1',
			'software_accounting' => 'Software Accounting',
			'software_crm' => 'Software Crm',
			'why_started' => 'Why Started',
			'enjoy_most' => 'Enjoy Most',
			'enjoy_least' => 'Enjoy Least',
			'challenge' => 'Challenge',
			'vision_verb1' => 'Vision Verb1',
			'vision_verb2' => 'Vision Verb2',
			'vision_what' => 'Vision What',
			'vision_whom' => 'Vision Whom',
			'vision_scale' => 'Vision Scale',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('account_id',$this->account_id);
		$criteria->compare('is_active',$this->is_active);
		$criteria->compare('company_name',$this->company_name,true);
		$criteria->compare('creation_date',$this->creation_date,true);
		$criteria->compare('year_founded',$this->year_founded);
		$criteria->compare('industry',$this->industry,true);
		$criteria->compare('business_type',$this->business_type,true);
		$criteria->compare('website',$this->website,true);
		$criteria->compare('revenue3',$this->revenue3);
		$criteria->compare('revenue2',$this->revenue2);
		$criteria->compare('revenue1',$this->revenue1);
		$criteria->compare('software_accounting',$this->software_accounting,true);
		$criteria->compare('software_crm',$this->software_crm,true);
		$criteria->compare('why_started',$this->why_started,true);
		$criteria->compare('enjoy_most',$this->enjoy_most,true);
		$criteria->compare('enjoy_least',$this->enjoy_least,true);
		$criteria->compare('challenge',$this->challenge,true);
		$criteria->compare('vision_verb1',$this->vision_verb1,true);
		$criteria->compare('vision_verb2',$this->vision_verb2,true);
		$criteria->compare('vision_what',$this->vision_what,true);
		$criteria->compare('vision_whom',$this->vision_whom,true);
		$criteria->compare('vision_scale',$this->vision_scale,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}