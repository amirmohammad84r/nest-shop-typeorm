import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPermition {
    @ApiProperty({
        example: '6c40d372-9940-4eab-8a5e-b459c00230f',
        description: 'id of a permition to add to a user',
    })
    @IsNotEmpty()
    @IsString()
    permitionId: string;
}
