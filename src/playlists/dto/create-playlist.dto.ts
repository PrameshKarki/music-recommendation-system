import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreatePlaylistDto {
    @ApiProperty({
        description: "Playlist name",
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        example: "4"
    })
    @IsNotEmpty()
    @IsString()
    thumbnail: string

    @ApiProperty({
        isArray: true,
        example: ["tag1", "tag2"]
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    tag?: string[]

    @ApiProperty({
        type: "boolean",
        example: false
    })
    @IsNotEmpty()
    @IsBoolean()
    isPrivate: boolean

    @ApiProperty({
        isArray: true,
        example: ["1", "2", "3"]
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    musics: string[]
}
