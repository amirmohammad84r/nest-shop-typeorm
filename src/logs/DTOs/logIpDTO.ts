import { IsDate, IsDateString, IsIP, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogDTO {
    @ApiProperty({
        example: '',
        description: 'User IP address',
    })
    @IsOptional()
    @IsIP()
    IP?: string;


    @ApiProperty({
        example: '',
        description: 'request type',
    })
    @IsOptional()
    @IsString()
    type?: string;


    @ApiProperty({
        example: '',
        description: 'UserName',
    })
    @IsOptional()
    @IsString()
    user?: string;


    @ApiProperty({
        example: '',
        description: 'start date',
    })
    @IsOptional()
    @Matches(/^[12]\d{3}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])$/, { message: 'your date is not valid' })
    dateStart?: Date;

    @ApiProperty({
        example: '',
        description: 'end date',
    })
    @IsOptional()
    @Matches(/^[12]\d{3}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])$/, { message: 'your date is not valid' })
    dateEnd?: Date;

    @ApiProperty({
        example: '',
        description: 'module',
    })
    @IsOptional()
    module?: string;
}
