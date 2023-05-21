import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ToggleLikePlaylistDto {
    @ApiProperty({
        example: "1"
    })
    @IsNotEmpty()
    @IsString()
    playlist: string
}