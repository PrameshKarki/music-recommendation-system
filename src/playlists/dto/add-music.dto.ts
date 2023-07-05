import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AddMusicInAPlaylistDTO {
    @ApiProperty({
        example: "1",
    })
    @IsNotEmpty()
    @IsString()
    playlist: string

    @ApiProperty({
        example: "1"
    })
    @IsNotEmpty()
    @IsString()
    music: string
}
