import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDTO {
    @ApiProperty({
        example: "@ldPassw@rd@123"
    })
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @ApiProperty({
        example: "NewPassw@rd@123"
    })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    newPassword: string;
}