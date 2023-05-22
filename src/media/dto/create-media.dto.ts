import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "../entities/media.entity";

export class CreateMediaDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;

    @ApiProperty({
        enum: MediaType
    })
    type: MediaType
}
