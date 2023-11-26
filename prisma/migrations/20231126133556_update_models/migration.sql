/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cart_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_cart_id_fkey`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `order_id` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `order` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_order_id_key` ON `Cart`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_user_id_key` ON `Order`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_cart_id_key` ON `Order`(`cart_id`);

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
