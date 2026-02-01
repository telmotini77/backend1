import { Module } from '@nestjs/common';
import { GuardsService } from './guards.service';
import { GuardsController } from './guards.controller';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [GuardsController],
  providers: [GuardsService, RolesGuard],
  exports: [RolesGuard],
})
export class GuardsModule {}
