import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        description: "User's email or mobile number",
        example: "johndoe@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @ApiProperty({
        description: "User's password",
        example: "John@123@"
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}