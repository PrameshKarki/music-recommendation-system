import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, ValidateNested } from "class-validator";
import { Gender } from "../../user/entity/userDetail.entity";

export class UserDetailDTO {
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

    @ApiProperty({
        example: "1998-12-12"
    })
    @IsNotEmpty()
    @IsDateString()
    dateOfBirth?: string;

    @ApiProperty({
        enum: Gender,
        type: "enum",
        example: Gender.MALE
    })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender?: Gender
}


export class UserRegisterDTO {
    @ApiProperty({
        example: "johndoe@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "9842473555"
    })
    @IsNotEmpty()
    @IsString()
    mobileNumber?: string;

    @ApiProperty({
        example: "John@123@"
    })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password?: string;

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @Type(() => UserDetailDTO)
    detail: UserDetailDTO

}