import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ToggleLikeMusicDto {
    @ApiProperty({
        example: "1"
    })
    @IsNotEmpty()
    @IsString()
    music: string
}