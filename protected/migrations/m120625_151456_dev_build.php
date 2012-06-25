<?php

class m120625_151456_dev_build extends CDbMigration
{
	public function up()
	{
            $this->execute("SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `myslapdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `myslapdb` ;

-- -----------------------------------------------------
-- Table `myslapdb`.`master_account`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`master_account` (
  `account_id` INT NOT NULL ,
  `is_active` TINYINT NULL ,
  `company_name` VARCHAR(255) NULL ,
  `creation_date` DATETIME NULL ,
  `year_founded` INT NULL ,
  `industry` VARCHAR(255) NULL ,
  `business_type` VARCHAR(45) NULL ,
  `website` VARCHAR(255) NULL ,
  `revenue3` INT NULL ,
  `revenue2` INT NULL ,
  `revenue1` INT NULL ,
  `software_accounting` VARCHAR(100) NULL ,
  `software_crm` VARCHAR(100) NULL ,
  `why_started` TEXT NULL ,
  `enjoy_most` TEXT NULL ,
  `enjoy_least` TEXT NULL ,
  `challenge` TEXT NULL ,
  `vision_verb1` ENUM('does','finds') NULL ,
  `vision_verb2` ENUM('for','with') NULL ,
  `vision_what` VARCHAR(45) NULL ,
  `vision_whom` VARCHAR(45) NULL ,
  `vision_scale` ENUM('national','global','regional') NULL ,
  PRIMARY KEY (`account_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`master_build`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`master_build` (
  `build_id` INT NOT NULL ,
  `account_id` INT NULL ,
  `start_date` DATETIME NULL ,
  `latest_page` INT NULL ,
  PRIMARY KEY (`build_id`) ,
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) ,
  INDEX `account` (`account_id` ASC) ,
  CONSTRAINT `account`
    FOREIGN KEY (`account_id` )
    REFERENCES `myslapdb`.`master_account` (`account_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`def_strategies`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`def_strategies` (
  `strategies_id` INT NOT NULL ,
  `title` VARCHAR(45) NULL ,
  `video_id` INT NULL ,
  `description` TEXT NULL ,
  PRIMARY KEY (`strategies_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_quarters`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_quarters` (
  `build_quarters_id` INT NOT NULL ,
  `build_id` INT NULL ,
  `quarter` ENUM('1','2','3','4') NULL ,
  `impact_customer` TEXT NULL ,
  `impact_client` TEXT NULL ,
  `strategy_id` INT NULL ,
  INDEX `build` (`build_id` ASC) ,
  INDEX `strategy` (`strategy_id` ASC) ,
  PRIMARY KEY (`build_quarters_id`) ,
  CONSTRAINT `build`
    FOREIGN KEY (`build_id` )
    REFERENCES `myslapdb`.`master_build` (`build_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `strategy`
    FOREIGN KEY (`strategy_id` )
    REFERENCES `myslapdb`.`def_strategies` (`strategies_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_events`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_events` (
  `build_id` INT NULL ,
  `name` VARCHAR(45) NULL ,
  `month` INT NULL ,
  INDEX `build` (`build_id` ASC) ,
  CONSTRAINT `build`
    FOREIGN KEY (`build_id` )
    REFERENCES `myslapdb`.`master_build` (`build_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_revenues`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_revenues` (
  `build_revenues_id` INT NOT NULL ,
  `build_id` INT NULL ,
  `name` VARCHAR(255) NULL ,
  `units` INT NULL ,
  `sell_price` INT NULL ,
  `display_order` INT NULL ,
  `original_percentage` FLOAT NULL ,
  PRIMARY KEY (`build_revenues_id`) ,
  INDEX `build` (`build_id` ASC) ,
  CONSTRAINT `build`
    FOREIGN KEY (`build_id` )
    REFERENCES `myslapdb`.`master_build` (`build_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_revenue_quarters`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_revenue_quarters` (
  `revenue_id` INT NULL ,
  `quarter_number` ENUM('1','2','3','4') NULL ,
  `units` INT NULL ,
  INDEX `revenue` (`revenue_id` ASC) ,
  CONSTRAINT `revenue`
    FOREIGN KEY (`revenue_id` )
    REFERENCES `myslapdb`.`build_revenues` (`build_revenues_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_revenue_costs`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_revenue_costs` (
  `revenue_id` INT NULL ,
  `cost_name` VARCHAR(45) NULL ,
  `quantity` INT NULL ,
  `per_unit` INT NULL ,
  INDEX `revenue` (`revenue_id` ASC) ,
  CONSTRAINT `revenue`
    FOREIGN KEY (`revenue_id` )
    REFERENCES `myslapdb`.`build_revenues` (`build_revenues_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`def_world_events`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`def_world_events` (
  `world_events_id` INT NOT NULL ,
  `name` VARCHAR(45) NULL ,
  `month` INT NULL ,
  PRIMARY KEY (`world_events_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`def_action_items`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`def_action_items` (
  `strategy_id` INT NULL ,
  `month` INT NULL ,
  `day` INT NULL COMMENT 'month and day are relative to a predefined standard date. they will need to be scaled based on start date' ,
  `description` VARCHAR(255) NULL ,
  INDEX `strategy` (`strategy_id` ASC) ,
  CONSTRAINT `strategy`
    FOREIGN KEY (`strategy_id` )
    REFERENCES `myslapdb`.`def_strategies` (`strategies_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_client`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_client` (
  `client_id` INT NOT NULL ,
  `build_id` INT NULL ,
  `name` VARCHAR(255) NULL ,
  `sex` ENUM('m','f') NULL ,
  `age` INT NULL ,
  `marital_status` ENUM('single','married','divorced') NULL ,
  `kids` TINYINT NULL ,
  `age_range` INT NULL ,
  `profession` ENUM('employed','self') NULL ,
  `work_type` ENUM('professional') NULL ,
  `seniority` ENUM('junior','mid','senior','ceo') NULL ,
  `income` INT NULL ,
  `housing` ENUM('own','rent') NULL ,
  `home_type` ENUM('condo','apartment','house','farm','other') NULL ,
  `home_location` ENUM('center') NULL ,
  `transportation` ENUM('transit','car') NULL ,
  `hobbies` VARCHAR(255) NULL ,
  `last_read` VARCHAR(255) NULL ,
  `notes` VARCHAR(255) NULL ,
  PRIMARY KEY (`client_id`) ,
  INDEX `build` (`build_id` ASC) ,
  CONSTRAINT `build`
    FOREIGN KEY (`build_id` )
    REFERENCES `myslapdb`.`master_build` (`build_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_expenses`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_expenses` (
  `build_id` INT NULL ,
  `is_personal` TINYINT NULL ,
  `name` VARCHAR(45) NULL ,
  `monthly_cost` INT NULL ,
  INDEX `build` (`build_id` ASC) ,
  CONSTRAINT `build`
    FOREIGN KEY (`build_id` )
    REFERENCES `myslapdb`.`master_build` (`build_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`master_user`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`master_user` (
  `user_id` INT NOT NULL ,
  `account_id` INT NULL ,
  `creation_date` DATETIME NULL ,
  `fname` VARCHAR(45) NULL ,
  `lname` VARCHAR(45) NULL ,
  `email` VARCHAR(255) NULL ,
  `password` VARCHAR(255) NULL ,
  `phone` VARCHAR(45) NULL ,
  `DOB` DATETIME NULL ,
  `address1` VARCHAR(255) NULL ,
  `address2` VARCHAR(255) NULL ,
  `role` INT NULL ,
  PRIMARY KEY (`user_id`) ,
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) ,
  INDEX `account` (`account_id` ASC) ,
  CONSTRAINT `account`
    FOREIGN KEY (`account_id` )
    REFERENCES `myslapdb`.`master_account` (`account_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`email_subscriptions`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`email_subscriptions` (
  `user_id` INT NULL ,
  `report_url` VARCHAR(255) NULL ,
  `status` TINYINT NULL ,
  `create_date` DATETIME NULL ,
  `cancelled_date` DATETIME NULL ,
  INDEX `user` (`user_id` ASC) ,
  CONSTRAINT `user`
    FOREIGN KEY (`user_id` )
    REFERENCES `myslapdb`.`master_user` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `myslapdb`.`build_action_items`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `myslapdb`.`build_action_items` (
  `quarters_id` INT NULL ,
  `strategy_id` INT NULL ,
  `month` INT NULL ,
  `day` INT NULL ,
  `description` VARCHAR(255) NULL ,
  INDEX `quarters` (`quarters_id` ASC, `strategy_id` ASC) ,
  INDEX `strategy` () ,
  CONSTRAINT `quarters`
    FOREIGN KEY (`quarters_id` , `strategy_id` )
    REFERENCES `myslapdb`.`build_quarters` (`build_quarters_id` , `strategy_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `strategy`
    FOREIGN KEY ()
    REFERENCES `myslapdb`.`def_strategies` ()
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
");
	}

	public function down()
	{
		echo "m120625_151456_dev_build does not support migration down.\n";
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