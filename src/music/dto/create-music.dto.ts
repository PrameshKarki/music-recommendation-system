import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMusicDto {
    @ApiProperty({
        example: "Maya raichha ra"
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example: "Fulbari"
    })
    @IsNotEmpty()
    @IsString()
    album: string;

    @ApiProperty({
        example: 300,
        description: "Duration in seconds"
    })
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty({
        isArray: true,
        example: ["Nabin K Bhattarai", "Sugam Pokharel"]
    })
    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    singer: string[];

    @ApiProperty({
        isArray: true,
        example: ["Nabin K Bhattarai", "Sugam Pokharel"]
    })
    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    writer: string[]

    @ApiProperty({
        isArray: true,
        example: ["Nabin K Bhattarai", "Sugam Pokharel"]
    })
    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    composer: string[];

    @ApiProperty({
        example: "Love song"
    })
    @IsNotEmpty()
    @IsString()
    genre: string;

    @ApiProperty({
        isArray: true,
        example: ["Maya", "Love"]
    })
    @IsNotEmpty()
    @IsString({ each: true })
    @IsArray()
    keywords: string[];

    @ApiProperty({
        type: "string",
        example: "2023-05-20T05:13:01.688Z"
    })
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    releaseDate: Date;

    @ApiProperty({
        type: "boolean",
        example: true
    })
    @IsNotEmpty()
    @IsBoolean()
    isPublished: boolean;

    @ApiProperty({
        required: false,
        example: "Maya raichha ra"
    })
    @IsOptional()
    @IsString()
    lyrics?: string

    @ApiProperty({
        example: "1"
    })
    @IsNotEmpty()
    @IsString()
    music: string

    @ApiProperty({
        example: "2"
    })
    @IsNotEmpty()
    @IsString()
    thumbnail: string
}


