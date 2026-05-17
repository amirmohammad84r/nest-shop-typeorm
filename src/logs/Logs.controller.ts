import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { Permission, Public, Roles } from 'src/auth/decorators';
import { LogDTO } from './DTOs/logIpDTO';
import { ConfigLogDTO } from './DTOs/configLogDTO';

@ApiTags('logs')
@ApiBearerAuth()
@Controller('logs')
export class CommonController {
    constructor(private readonly logService: LogsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all logs' })
    @ApiResponse({ status: 200, description: 'List of logs' })

    @ApiQuery({
        name: 'IP',
        required: false
    })
    @ApiQuery({
        name: 'type',
        required: false
    })
    @ApiQuery({
        name: 'user',
        required: false
    })
    @ApiQuery({
        name: 'dateStart',
        required: false
    })
    @ApiQuery({
        name: 'dateEnd',
        required: false
    })
    @ApiQuery({
        name: 'module',
        required: false
    })
    async getAllLogs(
        @Query() data: LogDTO
    ) {
        return await this.logService.findAllLogs(data.IP, data.type, data.user, data.dateStart, data.dateEnd, data.module)
    }

    @Post()
    @ApiOperation({ summary: 'config log' })
    @ApiResponse({ status: 201, description: 'config log create' })
    async configLog(@Body() config: ConfigLogDTO) {
        return await this.logService.configLog(config)
    }
}
