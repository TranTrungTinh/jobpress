import {
  Controller,
  // Get,
  Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/global';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('Upload file successfully')
  @UseInterceptors(FileInterceptor('file')) // tên field sử dụng trong form-data
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          // TODO: regex validate mime type jpg, png, jpeg, text, pdf
          fileType: /\/(jpg|jpeg|png|gif|text|pdf)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 1, // 1MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.upload(file);
  }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
