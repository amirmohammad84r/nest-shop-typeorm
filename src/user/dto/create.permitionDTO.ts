import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermitionDto {
    @ApiProperty({
        example: 'create-user',
        description: 'permition to creat a user',
    })
    @IsString()
    title: string;
}
