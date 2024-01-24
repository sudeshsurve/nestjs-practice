import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { createLoanDto } from 'src/loan/dto/createLoanDto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class LoanService {
  constructor(private neo4jService: Neo4jService) {}

  async createLoan(body: createLoanDto) {
    try {
      const matchQuey = `MATCH (l:Loan{loanNumber:"${body.loanNumber}"}) return l`;
      const resposne = await this.neo4jService.read(matchQuey);
      if (resposne.records.length > 0) {
        return {
          status: false,
          msg: 'Loan Number Already Exist',
          data: resposne.records[0].get('l').properties,
        };
      } else {
        const query = 'CREATE(l:Loan  $props) return l';
        const props = {
          props: { ...body, loanId: uuidv4() },
        };
        let result = await this.neo4jService.write(query, props);
        return {
          status: true,
          msg: 'successfull',
          data: result.records[0].get('l').properties,
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

  

}
