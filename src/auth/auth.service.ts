import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      name: body.name,
      email: body.email,
      passwordHash,
    });

    return { message: 'User registered', userId: user._id };
  }

  async login(body: any) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(body.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user._id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  refreshToken(token: string) {
    const payload = this.jwtService.verify(token);
    return {
      accessToken: this.jwtService.sign(
        { userId: payload.userId, role: payload.role },
        { expiresIn: '15m' },
      ),
    };
  }

  logout(userId: string) {
    return { message: 'Logged out successfully' };
  }
}
