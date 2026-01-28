-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `monthly_income` DOUBLE NULL,
    `monthly_expenses` DOUBLE NULL,
    `monthly_investment` DOUBLE NULL,
    `profession` VARCHAR(191) NULL,
    `goals` JSON NULL,
    `risk_appetite` VARCHAR(191) NULL,
    `investment_horizon` VARCHAR(191) NULL,
    `usage_reason` VARCHAR(191) NULL,
    `professional_status` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investment_recommendations` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `goals` JSON NOT NULL,
    `risk_appetite` VARCHAR(191) NOT NULL,
    `investment_horizon` VARCHAR(191) NOT NULL,
    `strategy_type` VARCHAR(191) NOT NULL,
    `equity_percentage` DOUBLE NOT NULL,
    `debt_percentage` DOUBLE NOT NULL,
    `large_cap_percentage` DOUBLE NOT NULL,
    `mid_cap_percentage` DOUBLE NOT NULL,
    `small_cap_percentage` DOUBLE NOT NULL,
    `emergency_fund_amount` DOUBLE NOT NULL,
    `monthly_sip_amount` DOUBLE NOT NULL,
    `risk_level` VARCHAR(191) NOT NULL,
    `goal_wise_split` JSON NOT NULL,
    `expected_return_range` JSON NOT NULL,
    `expected_ten_year_value` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `investment_recommendations` ADD CONSTRAINT `investment_recommendations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
