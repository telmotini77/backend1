import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seedAdmin(): Promise<void> {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123456';

    const existing = await this.usersRepository.findOne({
      where: { email: adminEmail },
    });

    if (existing) {
      this.logger.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = this.usersRepository.create({
      email: adminEmail,
      password: hashed,
      role: Role.ADMIN,
    });

    await this.usersRepository.save(admin);
    this.logger.log(
      `✅ Admin user created: ${adminEmail} (password: ${adminPassword})`,
    );
  }
}
