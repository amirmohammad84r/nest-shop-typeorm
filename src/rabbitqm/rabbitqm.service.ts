import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';
import * as bcrypt from 'bcryptjs';
import { RedisService } from 'src/redis/redis.service';
import { RoleRepository } from 'src/user/repositories/roleRepository';
import { UserRepository } from 'src/user/repositories/userRepository';

@Injectable()
export class RabbitmqService implements OnModuleInit {
    constructor(private readonly userRepo: UserRepository, private readonly roleRepo: RoleRepository,
        private readonly redis: RedisService,) { }

    private channel: amqp.Channel;
    private connection
    private time = Number(process.env?.RABBITMQ_REFRESH_TIME_PER_SECOUND)


    async onModuleInit() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue('register_queue', {
                durable: true,
            });

        } catch {
            console.log("rabbirmq is not avaible")
        }
        this.startHealthCheck()
    }

    startHealthCheck() {
        setInterval(async () => {
            try {
                if (!this.channel) throw new Error();
                await this.channel.checkQueue('register_queue');
            } catch {
                try {
                    this.connection = await amqp.connect('amqp://localhost');
                    this.channel = await this.connection.createChannel();
                    await this.channel.assertQueue('register_queue', {
                        durable: true,
                    });
                    this.addToRabbitMQFromRedis()
                } catch {
                    console.log("rabbitmq is not available");
                }
            }
        }, this.time * 1000);
    }
    getChannel() {
        return this.channel;
    }

    async addToRabitQueue() {
        const channel = await this.getChannel();
        if (channel) {
            channel.consume('register_queue', async (msg) => {
                if (!msg) return;

                try {
                    const { email, password, name } = JSON.parse(msg.content.toString());

                    const existingUser = await this.userRepo.findUserByEmailRepo(email);

                    if (existingUser) {
                        channel.ack(msg);
                        return;
                    }

                    let userRole = await this.roleRepo.findOneBy({ title: 'user' })
                    if (!userRole) {
                        userRole = await this.roleRepo.create({ title: "user" }).save()
                    }
                    if (!userRole) {
                        throw new BadRequestException("sorry try again")
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    await this.userRepo.create({
                        email,
                        name,
                        password: hashedPassword,
                        role: userRole
                    }).save();

                    channel.ack(msg);
                } catch (err) {
                    console.error(err);
                    channel.nack(msg)
                }
            });
        }
    }


    async addToRabbitMQFromRedis() {
        let item;

        while ((item = await this.redis.rPop('register_queue_backup'))) {
            const parsed = JSON.parse(item);

            await this.getChannel().sendToQueue(
                'register_queue',
                Buffer.from(JSON.stringify(parsed))
            );
        }
        this.addToRabitQueue()

    }
}
