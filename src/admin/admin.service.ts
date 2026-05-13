import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/userRepository';
import { CategoryRepository } from 'src/categories/repositories/categoryRepository';
import { ProductRepository } from 'src/products/repositories/productRepository';
import { OrderRepository } from 'src/orders/repositories/orderRepository';
import { CartRepository } from 'src/cart/repositories/cartRepository';
import { AddressesRepository } from 'src/addresses/repositories/addressRepository';
import { CouponsRepository } from 'src/coupons/repositories/couponRepository';
import { PaymentRepository } from 'src/payments/repositories/paymentRepo';
import { CommentsRepository } from 'src/comments/repositories/commentRepository';
import { PermitionsReposotory } from 'src/user/repositories/permitionRepository';
import { CreatePermitionDto } from 'src/user/dto/create.permitionDTO';
import { AddPermition } from 'src/user/dto/addPermitionToUser.DTO';
import { RoleRepository } from 'src/user/repositories/roleRepository';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { restoreDTO } from './DTO/restoreDBDTO';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AdminService {
  private backupPath = path.join(
    process.cwd(),
    'backups',
  );
  private manual = path.join(
    process.cwd(),
    'backups/manual',
  );
  private auto = path.join(
    process.cwd(),
    'backups/auto',
  );

  constructor(
    private readonly userRepo: UserRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly proRepo: ProductRepository,
    private readonly orderRepo: OrderRepository,
    private readonly cartRepo: CartRepository,
    private readonly adressRepo: AddressesRepository,
    private readonly coupRepo: CouponsRepository,
    private readonly payRepo: PaymentRepository,
    private readonly commentRepo: CommentsRepository,
    private readonly permitionRepo: PermitionsReposotory,
    private readonly roleRepo: RoleRepository

  ) {
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath);
    }
    if (!fs.existsSync(this.manual)) {
      fs.mkdirSync(this.manual);
    }
    if (!fs.existsSync(this.auto)) {
      fs.mkdirSync(this.auto);
    }
  }
  async getAllBackups(type: 'manual' | 'auto') {
    const files = fs.readdirSync(type === 'manual' ? this.manual : this.auto).map(file => {
      const fullPath = path.join(type === 'manual' ? this.manual : this.auto, file);
      const stat = fs.statSync(fullPath);
      return {
        file,
        createdAt: stat.birthtime,
        path: fullPath,
      };
    })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return {
      message: 'all backups recieved',
      detail: files,
      count: files.length
    }
  }



  async restoreBackUp(data: restoreDTO) {
    const fullPath = path.join(data.type === 'manual' ? this.manual : this.auto, data.file);
    if (!fs.existsSync(fullPath)) throw new BadRequestException('Backup file not found');
    const copyCommand = `docker cp "${fullPath.replace(/\\/g, '/')}" shop-postgres:/tmp/${data.file}`;
    const resetCommand = `docker exec -i shop-postgres psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`;
    const restoreCommand = `docker exec -i shop-postgres psql -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f /tmp/${data.file}`;
    return new Promise((resolve, reject) => {
      exec(copyCommand, (copyError, copyStdout, copyStderr) => {
        if (copyError) {
          return reject(copyError);
        }
        exec(resetCommand, (resetError, resetStdout, resetStderr) => {
          if (resetError) {
            return reject(resetError);
          }
          exec(restoreCommand, (restoreError, restoreStdout, restoreStderr) => {
            if (restoreError) {
              return reject(restoreError);
            }
            resolve({
              success: true,
              restored: data.file,
            });
          });
        });
      });
    });
  }

  @Cron('* * */6 * * *')
  async autoBackup() {
    await this.createBackUp('auto');
  }


  async createBackUp(type: 'manual' | 'auto') {
    if (!fs.existsSync(type === 'manual' ? this.manual : this.auto)) return [];

    const files = fs.readdirSync(type === 'manual' ? this.manual : this.auto)
      .map(file => {
        const fullPath = path.join(type === 'manual' ? this.manual : this.auto, file);
        const stat = fs.statSync(fullPath);

        return {
          file,
          createdAt: stat.birthtime,
          path: fullPath,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (files.length === 10) {
      fs.unlinkSync(files[files.length - 1].path);
    }
    const fileName =
      `backup-${Date.now()}.sql`;

    const fullPath = path.join(
      type === 'manual' ? this.manual : this.auto,
      fileName,
    );
    const command = `docker exec shop-postgres pg_dump -U ${process.env.DB_USER} ${process.env.DB_NAME}`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {

        if (error) {
          console.error(stderr);
          return reject(
            new InternalServerErrorException('Backup failed'),
          );
        }
        fs.writeFileSync(fullPath, stdout);
        resolve({
          success: true,
          file: fileName,
        });
      });

    });
  }


  async changeRoleOfUser(uesrid: string, roleid: CreatePermitionDto) {
    const role = await this.roleRepo.findByTitle(roleid.title)
    if (!role) {
      throw new NotFoundException('role not found');
    }
    console.log(role)
    const user = await this.userRepo.findUserByIdRepo(uesrid)
    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log(user)
    user.role = role
    const updatedUser = await this.userRepo.save(user);
    return {
      message: 'Permission added to role successfully',
      updatedUser,
    };
  }


  async findAllRoles() {
    return await this.roleRepo.findAll()
  }

  async createRole(roleDTO: CreatePermitionDto) {
    const role = await this.roleRepo.findByTitle(roleDTO.title)
    if (role) throw new ConflictException('role already exist')
    const roleCreated = await this.roleRepo.create({ type: roleDTO.type, title: roleDTO.title }).save()
    console.log(roleCreated)
    return roleCreated
  }

  async deleteRole(id: string) {
    const role = await this.roleRepo.findRoleById(id)
    if (!role) throw new NotFoundException('role not found')
    return this.roleRepo.delete(id)
  }


  //userPermition

  async addPermitionToAnRole(roleid: string, data: AddPermition) {
    const role = await this.roleRepo.findRoleById(roleid)
    if (!role) {
      throw new NotFoundException('role not found');
    }
    const permissionId = data.permitionId;
    const permission = await this.permitionRepo.findPermitionById(permissionId)
    if (!permission) {
      throw new NotFoundException('permission not found');
    }
    if (!role.permitions) {
      role.permitions = [];
    }
    console.log(role.permitions)
    const alreadyHasPermission = role.permitions.some(p => p.id === permission.id);
    if (alreadyHasPermission) {
      throw new ConflictException('permission already given');
    }
    role.permitions.push(permission);
    const updatedRole = await this.roleRepo.save(role);
    return {
      message: 'Permission added to role successfully',
      updatedRole,
    };
  }

  async deletePermitionFromRole(roleid: string, data: AddPermition) {
    const role = await this.roleRepo.findRoleById(roleid)
    if (!role) {
      throw new NotFoundException('user not found');
    }

    const permissionId = data.permitionId;
    const permission = await this.permitionRepo.findPermitionById(permissionId)
    if (!permission) {
      throw new NotFoundException('permission not found');
    }

    const alreadyHasPermission = role.permitions.some(p => p.id === permission.id);
    if (!alreadyHasPermission) {
      throw new ConflictException('permission already deleted');
    }

    role.permitions = role.permitions.filter(p => p.id !== permission.id);

    const updatedRole = await this.roleRepo.save(role);

    return {
      message: 'Permission added to user successfully',
      updatedRole,
    };
  }


  //Permition
  findAllPermiotions() {
    return this.permitionRepo.find();
  }

  async creatPermition(title: CreatePermitionDto) {
    const permition = await this.permitionRepo.findPermitionByTitle(title.title)
    if (permition) throw new ConflictException("permition already exist")
    return this.permitionRepo.create({ title: title.title }).save();
  }

  async deletePermition(id: string) {
    const permition = await this.permitionRepo.findPermitionByTitle(id)
    if (!permition) throw new ConflictException("permition already deleted")
    return this.permitionRepo.delete(id);
  }


  // USERS
  findAllUsers() {
    return this.userRepo.findAllUsersRepo();
  }

  findUserById(id: string) {
    return this.userRepo.findUserByIdRepo;
  }

  deleteUser(id: string) {
    return this.userRepo.delete(id);
  }

  // CATEGORIES
  findAllCategories() {
    return this.categoryRepo.findAllCategories();
  }

  // PRODUCTS
  findAllProducts() {
    return this.proRepo.findAllProducs();
  }

  // ORDERS
  findAllOrders() {
    return this.orderRepo.findAllOrders()
  }

  findOrderById(id: string) {
    return this.orderRepo.findOrderById(id)
  }

  // CARTS
  findAllCarts() {
    return this.cartRepo.findAllCarts()
  }

  // ADDRESSES
  findAllAddresses() {
    return this.adressRepo.findAllAddresses()
  }

  // COUPONS
  findAllCoupons() {
    return this.coupRepo.findAllCoupon();
  }

  // PAYMENTS
  findAllPayments() {
    return this.payRepo.findAllPays();
  }

  // COMMENTS
  findAllComments() {
    return this.commentRepo.findAllComments();
  }
}
