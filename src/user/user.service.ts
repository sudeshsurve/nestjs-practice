import { Injectable } from '@nestjs/common';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';
import { mergeWith } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private neo4jService: Neo4jService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const matchQuey = `MATCH (c:Customer{email: "${createUserDto.email}"})  return c`;
      const result = await this.neo4jService.read(matchQuey);
      if (result.records.length > 0) {
        return {
          status: false,
          msg: 'User is Already Exist',
          data: result.records[0].get('c').properties,
        };
        // WITH b
        // CREATE (b)-[r:HAS_CUSTOMER]->(u:Customer{ name: $name,gender: $gender,email: $email,age: $age, userName: $userName, birthDate: $birthDate,customerId:"${uuidv4()}"}) return u )
      } else {
        let query = `MATCH (b:Branch{branchId: $branchId}) 
        CREATE (b)-[r:HAS_CUSTOMER]->(c:Customer{ name: $name,gender: $gender,email: $email,age: $age, userName: $userName, birthDate: $birthDate,customerId:"${uuidv4()}"})                                                                                                                                                                                  
        return  c`;
        const props = {
          ...createUserDto,
        };
        const result = await this.neo4jService.write(query, props);

        return {
          status: true,
          msg: 'Successfully Created',
          data: result.records[0].get('c').properties,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message,
      };
    }
  }

  async findAll(id: string) {
    try {
      const query = `Match (b:Branch {branchId:"${id}"})-[:HAS_CUSTOMER]-(c:Customer)
      OPTIONAL MATCH (c)-[:HAS_ADDRESS]->(a:Address)
      return c , a`;
      let result = await this.neo4jService.read(query);
      if (result.records.length > 0) {
        let data = [];
        result.records.forEach((e) => {
          data.push({
            ...e.get('c').properties,
            address: e.get('a')?.properties,
          });
        });
        return {
          status: true,
          msg: 'Successfull',
          data,
        };
      } else {
        return {
          status: false,
          msg: 'Customer Not Found',
          data: null,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message,
      };
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const query = `Match (c:Customer{customerId:"${updateUserDto.customerId}"}) SET c = $props  return c`;
      const props = {
        props: updateUserDto,
      };
      console.log(query);
      const result = await this.neo4jService.write(query, props);
      console.log(result);
      if (result.records.length > 0) {
        return {
          status: true,
          msg: 'Successfully Updated',
          data: result.records[0].get('c').properties,
        };
      } else {
        return {
          status: false,
          msg: 'someting Went Wronge',
          data: null,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: error.message,
      };
    }
  }

  async remove(body: any) {
    try {
      const query = `Match (n:Customer { customerId: "${body.customerId}"}) delete n`;
      await this.neo4jService.write(query);
      return {
        status: true,
        msg: 'Successfully Deleted',
      };
    } catch (error) {
      return {
        status: false,
        msg: error.message,
      };
    }
  }

  async createAddress(address: AddressDto) {
    try {
      let props = {
        ...address,
      };

      const matchQuery = `
       MATCH (c:Customer{customerId : "${address.customerId}"})
       OPTIONAL MATCH (c)-[r:HAS_ADDRESS]->(a:Address)
       return r , a , c
       `;
      const response = await this.neo4jService.read(matchQuery);
      if (response.records.length == 0) {
        return {
          status: false,
          msg: 'User Not Found',
          data: null,
        };
      }
      if (response.records[0].get('r') == null) {
        const mergeQuery = `MATCH (c:Customer{customerId : $customerId}) WITH c  MERGE (a:Address {state:$state, country:$country ,city:$city , addressId:"${uuidv4()}",  fullAddress:$fullAddress , pincode:$pincode}) MERGE (c)-[:HAS_ADDRESS]->(a)  return a`;
        console.log(mergeQuery);
        let response = await this.neo4jService.write(mergeQuery, props);
        return {
          status: true,
          msg: 'successfully Created',
          data: response.records[0].get('a').properties,
        };
      } else {
        let addressId = response.records[0].get('a').properties.addressId;
        const updateQuery = `MATCH (add:Address {addressId : "${addressId}"}) SET
         add.fullAddress = "${props.fullAddress}" , 
         add.state = "${props.state}" ,
         add.city = "${props.city}" ,
         add.country = "${props.country}" 
         return add`;
        let respone = await this.neo4jService.write(updateQuery, props);
        return {
          status: true,
          msg: 'Address Updated Successfully',
          data: respone.records[0].get('add').properties,
        };
      }
    } catch (error) {
      return error;
    }
  }
}
