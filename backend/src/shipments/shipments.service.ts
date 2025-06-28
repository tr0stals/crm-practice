import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { Repository } from 'typeorm';
import { ShipmentsDTO } from './dto/shipmentsDTO';

@Injectable()
export class ShipmentsService {
    constructor(
        @InjectRepository(Shipments)
        private repository: Repository<Shipments>,
      ) {}
    
      async create(data: ShipmentsDTO) : Promise<Shipments> {
        try{
          const entity = this.repository.create(data);
          return await this.repository.save(entity);
        }catch(e){
          console.error('Ошибка при создании записи:', e);
          throw e;
        }
      }
    
      async update(id: number, data: ShipmentsDTO): Promise<Shipments> {
        try{
          await this.findOne(id);
          await this.repository.update(id, data);
          return await this.findOne(id);
        }
        catch(e){
          console.error('Ошибка при обновлении записи', e);
          throw e;
        }
      }
    
      async remove(id: number): Promise<void> {
        try {
          await this.findOne(id);
          await this.repository.delete(id);
        }
        catch(e){
          console.error('ошибка при удалении', e);
          throw e;
        }
      }
    
      async findOne(id: number): Promise<Shipments> {
        const entity= await this.repository.findOne({
          where: {id},
          relations: ["licenses", 'factory', 'transporter', 'client']});
        
        if(!entity)
          throw new NotFoundException(`Поставка с ${id} не найдена`);

        return entity;
      }

      async findAll():Promise<Shipments[]>{
        try{
          return await this.repository.find({
          relations:["licenses", 'factory', 'transporter', 'client']});
        }
        catch(e){
          console.error('Записи не найдены', e);
          throw e;
        }
      }
}
