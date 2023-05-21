import { Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller({
  version: '1',
  path: 'media'
})
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @ApiOperation({
    summary: "Upload a new media file",
  })
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMediaDto,
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        const filename = `${year}${month}${day}${hour}${minute}${second}${path.extname(file.originalname)}`
        cb(null, filename)
      }
    })
  }))
  async upload(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10, message: "File size must be less than 10MB" })
    ]
  })) file: Express.Multer.File, @Body() body: CreateMediaDto) {
    const media = await this.mediaService.create(file.filename, file.mimetype, body.type);
    return { data: media }
  }

  @ApiOperation({
    summary: "Delete a media file",
  })
  @Delete(":id")
  async deleteMedia(@Param() id: string) {
    const media = await this.mediaService.findOne(id);
    await this.mediaService.softRemove(media);
    return { data: media }
  }

  @ApiOperation({
    summary: "Get a media file",
  })
  @Get(":id")
  async getMedia(@Param() id: string) {
    const media = await this.mediaService.findOne(id);
    return { data: media }
  }


}
