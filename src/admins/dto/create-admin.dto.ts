import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, ValidateNested } from "class-validator";
import { RoleLevel } from "../entities/admin.entity";

export class AdminDetailDTO {
    @ApiProperty({
        example: "John"
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    middleName?: string;

    @ApiProperty({
        example: "Doe"
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;
}


export class CreateAdminDto {
    @ApiProperty({
        example: "johndoe@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @ApiProperty({
        example: "John@123@"
    })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        enum: RoleLevel,
        example: RoleLevel.ONE
    })
    @IsNotEmpty()
    @IsEnum(RoleLevel)
    roleLevel: RoleLevel

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @Type(() => AdminDetailDTO)
    detail: AdminDetailDTO

}