import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { v4 as uuidv4 } from 'uuid';
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('createBranch')
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }


   
}
