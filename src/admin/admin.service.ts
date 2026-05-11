import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class AdminService {
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
  ) { }

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
