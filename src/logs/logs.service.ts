import { BadRequestException, Injectable, Ip, NotFoundException } from '@nestjs/common';
import { LogsRepository } from './repositories/logRepository';
import { LogModel } from './logModel';
import { UserRepository } from 'src/user/repositories/userRepository';
import { Between, In, Like } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import moment from 'moment-jalaali';

@Injectable()
export class LogsService {
    constructor(
        private readonly logsRepository: LogsRepository,
        private readonly userRepository: UserRepository,
        private readonly common: CommonService
    ) {
        moment.loadPersian();
    }

    async findAllLogs(ip?: string, type?: string, user?: string, dateStart?: Date, dateEnd?: Date, module?: string) {
        let modules: string[] | undefined = undefined
        if (module) modules = this.common.findModuleByFAName(module)
        let dateStartInGregory: Date | undefined = undefined
        let dateEndIGregory: Date | undefined = undefined
        let filter: any = {}
        if (ip !== undefined) Object.assign(filter, { ip: Like(`%${ip}%`) })
        if (type !== undefined) Object.assign(filter, { type: Like(`%${type}%`) })
        if (user !== undefined) Object.assign(filter, { user: { name: Like(`%${user}%`) } })
        if (modules?.length) Object.assign(filter, { Module: In(modules), });
        if (dateStart !== undefined) dateStartInGregory = moment(dateStart, 'jYYYY/jMM/jDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        if (dateEnd !== undefined) dateEndIGregory = moment(dateEnd, 'jYYYY/jMM/jDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        if (dateStartInGregory !== undefined && dateEndIGregory !== undefined) Object.assign(filter, {
            createdAt: Between(new Date(dateStartInGregory), new Date(dateEndIGregory)),
        });

        if (dateStartInGregory !== undefined && dateEndIGregory == undefined) {
            Object.assign(filter, {
                createdAt: Between(new Date(dateStartInGregory), new Date()),
            });
        }
        const allLogs = await this.logsRepository.findAllLogs(filter)
        const allLogsChanged = allLogs.map(log => {
            return {
                id: log.id,
                ip: log.ip,
                type: log.type,
                discription: log.discription,
                module: log.Module,
                updatedFields: log.updatedFields,
                createAt: moment(log.createdAt).format('jYYYY/jMM/jDD HH:mm:ss'),
                user: {
                    id: log.user.id,
                    name: log.user.name
                }
            }
        })
        return allLogsChanged
    }

    async createLog(log: LogModel) {
        const userinfo = await this.userRepository.findUserByIdRepo(log.userid);
        if (!userinfo) throw new NotFoundException("user not found");
        let logModule = log.module.slice(1);
        const slashindex = logModule.indexOf('/');
        const qsindex = logModule.indexOf('?');
        if (slashindex !== -1) logModule = logModule.slice(0, slashindex);
        if (qsindex !== -1) logModule = logModule.slice(0, qsindex);
        const createdLog = await this.logsRepository.insert({
            ip: log.ip,
            type: log.type,
            discription: log.discription,
            Module: log.module,
            updatedFields: log.updatedFields as any,
            user: userinfo,
            userAgent: log.userAgent,
            duration: log.duration
        });
    }
}
