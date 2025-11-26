// src/images/images.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from './images.entity';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private imagesRepository: Repository<Images>,
  ) {}

  async createImage(file: any, body: any): Promise<Images> {
    const { targetType, targetId } = body;

    if (!targetType || !targetId) {
      throw new NotFoundException('targetType и targetId обязательны');
    }

    const image = this.imagesRepository.create({
      filename: file?.filename,
      originalName: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      path: `uploads/${file?.filename}`,
      targetType,
      targetId,
    });

    return await this.imagesRepository.save(image);
  }

  async getImageById(id: number): Promise<Images> {
    const image = await this.imagesRepository.findOne({ where: { id } });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }

  async getImagesByTarget(
    targetType: string,
    targetId: number,
  ): Promise<Images[]> {
    return await this.imagesRepository.find({
      where: { targetType, targetId },
    });
  }

  async deleteImagesByTarget(targetType: string, targetId: number) {
    const targetImage = await this.getImagesByTarget(targetType, targetId);

    if (!targetImage) return;

    targetImage.map(async (item) => await this.deleteImage(item?.id));
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.getImageById(id);

    try {
      const fullPath = join(process.cwd(), image.path);
      if (existsSync(fullPath)) unlinkSync(fullPath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.imagesRepository.delete(id);
  }

  async updateImage(id: number, file: any, body: any): Promise<Images> {
    const image = await this.getImageById(id);

    // если файл пришёл — заменяем физический файл и метаданные
    if (file) {
      try {
        const oldPath = join(process.cwd(), image.path);
        if (existsSync(oldPath)) unlinkSync(oldPath);
      } catch (e) {
        console.error('Не удалось удалить старый файл', e);
      }

      image.filename = file.filename;
      image.originalName = file.originalname;
      image.mimetype = file.mimetype;
      image.size = file.size;
      image.path = `uploads/${file.filename}`;
    }

    // эти поля можно менять даже без файла
    image.targetType = body.targetType || image.targetType;
    image.targetId = body.targetId ?? image.targetId;

    return await this.imagesRepository.save(image);
  }
}
