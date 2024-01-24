import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { UserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { BranchModule } from './branch/branch.module';
import { EmployeModule } from './employe/employe.module';
import { PaymentModule } from './payment/payment.module';
import { AccountModule } from './account/account.module';
let configService = new ConfigService();
@Module({
  imports: [
     ConfigModule.forRoot({isGlobal:true}),
     Neo4jModule.forRoot({
      scheme: configService.get('NEO_SCHEAMA'),
      host: configService.get('NEO_HOST'),
      port: configService.get('NEO_PORT'),
      username: configService.get('NEO_USERNAME'),
      password: configService.get('NEO_PASSWORD'),
    }),
     UserModule,
     LoanModule,
     BranchModule,
     EmployeModule,
     PaymentModule,
     AccountModule,

  ],
  controllers: [AppController,],
  providers: [AppService ],
})
export class AppModule {}
