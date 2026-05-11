import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/repositories/userRepository';
import { RedisService } from 'src/redis/redis.service';
import { RabbitmqService } from 'src/rabbitqm/rabbitqm.service';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redis: RedisService,
    private readonly rabbitmq: RabbitmqService
  ) { }

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userRepo.findUserByEmailRepo(email);
    if (existingUser) {
      return { message: "email already exist" };
    }

    try {
      const channel = this.rabbitmq.getChannel()
      channel.sendToQueue(
        'register_queue',
        Buffer.from(JSON.stringify({ email, password, name }))
      );
      this.rabbitmq.addToRabitQueue()
      return { message: 'registered' };
    } catch {
      await this.redis.lPush(
        'register_queue_backup',
        JSON.stringify({ email, password, name })
      );
      return { message: 'registered' };
    }
  }



  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const waitingTime = 100

    const times = await this.redis.get(`login:fail:${email}`)

    if (times === 3) {
      const ttl = await this.redis.ttl(`login:fail:${email}`)
      throw new UnauthorizedException(`you banned for ${this.changeNumberToHourMinAndSec(ttl)}`)
    }
    const user = await this.userRepo.findUserByEmailRepo(email);
    if (!user) {
      this.incrAndExpire(`login:fail:${email}`, waitingTime)
      throw new UnauthorizedException('Invalid email');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      this.incrAndExpire(`login:fail:${email}`, waitingTime)
      throw new UnauthorizedException('Invalid password');
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    await this.redis.del(`login:fail:${email}`)
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }





  changeNumberToHourMinAndSec(num: number) {
    const h = Math.floor(num / 3600);
    const m = Math.floor((num % 3600) / 60);
    const s = num % 60;

    return `${h}h ${m}m ${s}s`;
  }
  async incrAndExpire(email: string, expire: number) {
    await this.redis.incre(email)
    await this.redis.expir(email, expire);
  }
}
