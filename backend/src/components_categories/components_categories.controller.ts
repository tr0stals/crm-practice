import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComponentsCategoriesService } from './components_categories.service';

@Controller('components_categories')
export class ComponentsCategoriesController {
  constructor(private readonly service: ComponentsCategoriesService) {}

  @Get('categories')
  getCategories() {
    return this.service.findAll();
  }

  @Post('categories')
  createCategory(@Body() dto: { name: string }) {
    return this.service.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: number, @Body() dto: { name?: string }) {
    return this.service.updateCategory(+id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.service.deleteCategory(+id);
  }

  @Get('subcategories')
  listSubcategories() {
    return this.service.listSubcategories();
  }

  @Post('subcategories')
  createSubcategory(@Body() dto: { name: string; categoryId: number }) {
    return this.service.createSubcategory(dto);
  }

  @Patch('subcategories/:id')
  updateSubcategory(
    @Param('id') id: number,
    @Body() dto: { name?: string; categoryId?: number },
  ) {
    return this.service.updateSubcategory(+id, dto);
  }

  @Delete('subcategories/:id')
  deleteSubcategory(@Param('id') id: number) {
    return this.service.deleteSubcategory(+id);
  }
}


