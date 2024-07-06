import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createEmployeeDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createEmployeeDto });
  }

  async findAll(role?: 'INTERN' | 'ADMIN' | 'MODERATOR') {
    let whereClause = {};

    if (role) {
      whereClause = { role: role };
    }

    const employees = await this.databaseService.user.findMany({
      where: whereClause,
    });

    if (employees.length === 0) {
      throw new NotFoundException('Employees Not Found');
    }

    return employees;
  }

  async findOne(id: string) {
    const employee = await this.databaseService.user.findUnique({
      where: { id: id },
    });
    if (!employee) throw new NotFoundException('Employee not Found');
    return employee;
  }

  async update(id: string, updateEmployeeDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id: id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.user.delete({ where: { id: id } });
  }
}
