import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class BranchService {
  constructor(private neo4jService: Neo4jService) {}
  async create(createBranchDto: CreateBranchDto) {
    try {
      const matchQuery = `MATCH (b:Branch {branchCode: $branchCode}) return b`;
      const props = {
        ...createBranchDto,
      };
      const result = await this.neo4jService.write(matchQuery, props);
      if (result.records.length > 0) {
        return {
          status: false,
          mag: 'Branch is already Exist',
          data: result.records[0].get('b').properties,
        };
      } else {
        const createQuery = `MERGE (b:Branch {
     branchName: $branchName,
    city: $city,
    assets: $assets,
    liblities: $liblities,
    branchCode:$branchCode,
    branchId: "${uuidv4()}"
        }) return b`;
        const result = await this.neo4jService.write(createQuery, props);
        return {
          mag: 'Branch Created SuccesFully',
          status: true,
          data: result.records[0].get('b').properties,
        };
      }
    } catch (error) {
      return {
        mag: error.message,
        status: false,
        data: null,
      };
    }
  }

//  async createRelationShip(body) {
//      try {
//        const retionShipQuery = `MATCH (b : Branch{branchId : } )`
//          const props = {
           
//          }
//      } catch (error) {
      
//      } 
//   }

  findAll() {
    return `This action returns all branch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
