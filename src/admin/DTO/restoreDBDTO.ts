import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BackupType {
    MANUAL = 'manual',
    AUTO = 'auto',
}

export class restoreDTO {
    @ApiProperty({
        example: 'backup-1778654063265.sql',
        description: 'file name of your backup',
    })
    @IsNotEmpty()
    @IsString()
    file: string;

    @ApiProperty({
        example: 'manual',
        description: 'its a auto backup or manual',
    })
    @IsNotEmpty()
    @IsString()
    @IsEnum(BackupType)
    type: BackupType;
}
