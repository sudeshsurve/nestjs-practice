import { Body, Controller, Post } from '@nestjs/common';
import { LoanService } from './loan.service';
import { createLoanDto } from 'src/loan/dto/createLoanDto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}
    

  @Post("createLoan")
  createLoan(@Body() body: createLoanDto){
     return this.loanService.createLoan(body)
  } 

   
   

  
   
}
