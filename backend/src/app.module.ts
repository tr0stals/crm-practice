import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { RegionModule } from './region/region.module';
import { LocationsModule } from './locations/locations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationTypesModule } from './organization-types/organization-types.module';
import { DepartmentsModule } from './departments/departments.module';
import { GroupsModule } from './groups/groups.module';
import { TutorsModule } from './tutors/tutors.module';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { StudentsModule } from './students/students.module';
import { RightsModule } from './rights/rights.module';
import { RoleRightsModule } from './role-rights/role-rights.module';
import { LicenseModule } from './license/license.module';
import { LicenseTypesModule } from './license-types/license-types.module';
import { EmployeesModule } from './employees/employees.module';
import { StandsController } from './stands/stands.controller';
import { StandsModule } from './stands/stands.module';
import { StandCategoriesService } from './stand-categories/stand-categories.service';
import { StandCategoriesModule } from './stand-categories/stand-categories.module';
import { StandCoursesController } from './stand-courses/stand-courses.controller';
import { StandCoursesModule } from './stand-courses/stand-courses.module';
import { StandTypesService } from './stand-types/stand-types.service';
import { StandTypesModule } from './stand-types/stand-types.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mysqlpassword123!',
      database: 'crm_practice',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      extra: {
        charset: 'utf8mb4',
      },
    }),
    UserModule,
    AuthModule,
    CountriesModule,
    RegionModule,
    LocationsModule,
    OrganizationsModule,
    OrganizationTypesModule,
    DepartmentsModule,
    GroupsModule,
    TutorsModule,
    RolesModule,
    UserRolesModule,
    StudentsModule,
    RightsModule,
    RoleRightsModule,
    LicenseModule,
    LicenseTypesModule,
    EmployeesModule,
    StandsModule,
    StandCategoriesModule,
    StandCoursesModule,
    StandTypesModule,
    ShipmentsModule,
    DatabaseModule
  ],
  controllers: [AppController, StandsController, StandCoursesController],
  providers: [AppService, StandCategoriesService, StandTypesService],
})
export class AppModule {}
