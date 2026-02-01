import { Injectable } from '@nestjs/common';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';

@Injectable()
export class GuardsService {
  create(_createGuardDto: CreateGuardDto) {
    void _createGuardDto;
    return 'This action adds a new guard';
  }

  findAll() {
    return `This action returns all guards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guard`;
  }

  update(id: number, _updateGuardDto: UpdateGuardDto) {
    void _updateGuardDto;
    return `This action updates a #${id} guard`;
  }

  remove(id: number) {
    return `This action removes a #${id} guard`;
  }
}
