import { Injectable } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class EmployeService {
  constructor(private neo4jService: Neo4jService) {}
  async create(createEmployeDto: CreateEmployeDto) {
    try {
      const query = 'MATCH (e:Employe{email: $email}) return e';
      const props = {
        ...createEmployeDto,
      };
      const result = await this.neo4jService.write(query, props);
      if (result.records.length > 0) {
        return {
          status: false,
          msg: 'Employe Already exist',
          data: result.records[0].get('e').properties,
        };
      } else {
        let createQuery = `CREATE (e:Employe { employeCode: $employeCode,
        name: $name,
        contactNumber: $contactNumber,
        gender: $gender,
        email: $email,
        yearOfService: $yearOfService,
        employeId: "${uuidv4()}",
        joiningDate: $joiningDate}) return e`;
        let respone = await this.neo4jService.write(createQuery, props);
        return {
          status: true,
          msg: 'Employe Created Succesfully',
          data: respone.records[0].get('e').properties,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message,
        data: null,
      };
    }
  }

  findAll() {
    return `This action returns all employe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employe`;
  }

  update(id: number, updateEmployeDto: UpdateEmployeDto) {
    return `This action updates a #${id} employe`;
  }

  remove(id: number) {
    return `This action removes a #${id} employe`;
  }
}
