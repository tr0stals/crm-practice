// src/images/images.controller.ts
import {
  Controller,
  Get,
  Param,
  Res,
  Delete,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Patch,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { Images } from './images.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // images.controller.ts
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: any, @Body() body: any) {
    // передаём все возможные foreign keys
    return await this.imagesService.createImage(file, body);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    return await this.imagesService.updateImage(id, file, body);
  }

  // src/images/images.controller.ts
  @Get('byTarget/:targetType/:id')
  async getImagesByTarget(
    @Param('targetType') targetType: string,
    @Param('id') id: string,
  ) {
    return await this.imagesService.getImagesByTarget(targetType, +id);
  }

  @Delete('byTarget/:targetType/:id')
  async deleteImagesByTarget(
    @Param('targetType') targetType: string,
    @Param('id') id: string,
  ) {
    return await this.imagesService.deleteImagesByTarget(targetType, +id);
  }

  @Get(':id')
  async getImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const image = await this.imagesService.getImageById(id);
    return this.serveImage(image, res);
  }

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    await this.imagesService.deleteImage(id);
    return { message: 'Image deleted successfully' };
  }

  private serveImage(image: Images, res: Response) {
    const filePath = join(process.cwd(), image.path);

    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', image.mimetype);
    res.setHeader('Content-Length', image.size);
    res.sendFile(filePath);
  }
}
