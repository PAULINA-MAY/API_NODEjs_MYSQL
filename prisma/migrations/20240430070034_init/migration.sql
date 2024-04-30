-- CreateTable
CREATE TABLE `User` (
    `Id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstNames_user` VARCHAR(191) NOT NULL,
    `LastNames_user` VARCHAR(191) NOT NULL,
    `Email_user` VARCHAR(191) NOT NULL,
    `Password_user` VARCHAR(191) NOT NULL,
    `ImgProfile_user` VARCHAR(191) NOT NULL,
    `DateCreated_user` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `DateModified_user` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `Id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `Id_user_FK` INTEGER NOT NULL,
    `Name_rol` VARCHAR(191) NOT NULL DEFAULT 'user',

    UNIQUE INDEX `Rol_Id_user_FK_key`(`Id_user_FK`),
    PRIMARY KEY (`Id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rol` ADD CONSTRAINT `Rol_Id_user_FK_fkey` FOREIGN KEY (`Id_user_FK`) REFERENCES `User`(`Id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
