import {
  Controller,
  // Get,
  Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/global';
import { ApiTags } from '@nestjs/swagger';
import { FileExceptionFilter } from './file-exception.filter';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ResponseMessage('Upload file successfully')
  @UseInterceptors(FileInterceptor('file')) // tên field sử dụng trong form-data
  @UseFilters(FileExceptionFilter)
  uploadFile(file: Express.Multer.File) {
    return this.filesService.upload(file);
  }
}
