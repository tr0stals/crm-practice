import { StandCategories } from 'src/stand-categories/stand-categories.entity';
import { StandCourses } from 'src/stand-courses/stand-courses.entity';
import { StandsTypes } from 'src/stand-types/stand-types.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stands {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StandCourses, (standCourse) => standCourse.standCourses)
  @JoinColumn({ name: 'standCourseId' })
  standCourses: StandCourses;

  @ManyToOne(() => StandsTypes, (standType) => standType.standsTypes)
  @JoinColumn({ name: 'standTypeId' })
  standsTypes: StandsTypes;

  @ManyToOne(
    () => StandCategories,
    (standcategory) => standcategory.standcategories,
  )
  @JoinColumn({ name: 'standCategoryId' })
  standsCategories: StandCategories;

  @Column()
  shortName: string;

  @Column()
  fullName: string;

  @Column()
  hyperLink: string;

  @Column()
  image: string;

  @Column()
  vendorCode: string;

  @Column()
  comment: string;
}
