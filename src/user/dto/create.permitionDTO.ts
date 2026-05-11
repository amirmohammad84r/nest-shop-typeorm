import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { roles } from '../entities/role';

export class CreatePermitionDto {
    @ApiProperty({
        example: 'manager',
        description: 'insert a role like admin manager user warehouse',
    })
    @IsString()
    @IsEnum(roles)
    type: roles;

    @ApiProperty({
        example: 'manager1',
        description: 'permition to creat a user',
    })
    @IsString()
    title: string;
}
