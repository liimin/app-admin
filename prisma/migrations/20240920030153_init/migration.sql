-- CreateTable
CREATE TABLE `device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sn` VARCHAR(20) NOT NULL,
    `create_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` INTEGER NOT NULL DEFAULT 0,
    `user` VARCHAR(20) NULL,
    `last_log_upload_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_log_remove_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mobile` VARCHAR(20) NULL,
    `merchant_name` VARCHAR(50) NULL,

    UNIQUE INDEX `device_info_device_id_key`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device_status` (
    `device_id` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` INTEGER NOT NULL DEFAULT 0,
    `path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `log_device_id_key`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_id` INTEGER NOT NULL DEFAULT 0,
    `log_saved_days` TINYINT NULL DEFAULT 7,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `log_config_device_id_key`(`device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_config_userfield_relation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `config_id` INTEGER NOT NULL DEFAULT 0,
    `user_field_id` INTEGER NOT NULL DEFAULT 0,

    INDEX `FK_log_config_userfield_relation_log_config`(`config_id`),
    INDEX `FK_log_config_userfield_relation_log_user_field`(`user_field_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_user_field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `device_info` ADD CONSTRAINT `FK_device_info_device` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_status` ADD CONSTRAINT `FK__device` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `device_status` ADD CONSTRAINT `FK__device_info` FOREIGN KEY (`device_id`) REFERENCES `device_info`(`device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `FK_log_device` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `FK_log_device_info` FOREIGN KEY (`device_id`) REFERENCES `device_info`(`device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log_config` ADD CONSTRAINT `FK_log_config_device` FOREIGN KEY (`device_id`) REFERENCES `device`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log_config` ADD CONSTRAINT `FK_log_config_device_info` FOREIGN KEY (`device_id`) REFERENCES `device_info`(`device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log_config_userfield_relation` ADD CONSTRAINT `FK_log_config_userfield_relation_log_config` FOREIGN KEY (`config_id`) REFERENCES `log_config`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `log_config_userfield_relation` ADD CONSTRAINT `FK_log_config_userfield_relation_log_user_field` FOREIGN KEY (`user_field_id`) REFERENCES `log_user_field`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
