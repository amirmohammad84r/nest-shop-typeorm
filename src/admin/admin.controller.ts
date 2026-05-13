import { Controller, Get, Param, Delete, Post, Body, Patch, ParseEnumPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreatePermitionDto } from 'src/user/dto/create.permitionDTO';
import { AddPermition } from 'src/user/dto/addPermitionToUser.DTO';
import { BackupType, restoreDTO } from './DTO/restoreDBDTO';


@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }


  //backup nd restore
  @Get('backups/:type')
  @ApiOperation({ summary: 'get all backups (admin only)' })
  getAllBackups(@Param('type', new ParseEnumPipe(BackupType))
  type: BackupType) {
    return this.adminService.getAllBackups(type)
  }

  @Post('backup')
  @ApiOperation({ summary: 'make a backup (admin only)' })
  async createBackup() {
    return await this.adminService.createBackUp()
  }

  @Post('restore')
  @ApiOperation({ summary: 'restore (admin only)' })
  restoreBackUp(@Body() data: restoreDTO) {
    return this.adminService.restoreBackUp(data)
  }




  //asigne role to user
  @Patch('changerole/:id')
  @ApiOperation({ summary: 'change user role (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  changeUserRoleById(@Param('id') userid: string, @Body() roleid: CreatePermitionDto) {
    return this.adminService.changeRoleOfUser(userid, roleid)
  }

  //roles
  @Get('roles')
  @ApiOperation({ summary: 'get all roles (admin only)' })
  getAllRoles() {
    return this.adminService.findAllRoles()
  }

  @Post('roles')
  @ApiOperation({ summary: 'create a new role (admin only)' })
  createRole(@Body() roleDTO: CreatePermitionDto) {
    return this.adminService.createRole(roleDTO)
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'delete a role (admin only)' })
  deleteARole(@Param('id') id: string) {
    return this.adminService.deleteRole(id)
  }


  //give a user some permitions

  @Patch("rolePermition/:id")
  @ApiOperation({ summary: 'Add some permition to an user(admin only)' })
  addSomePermitionToUser(@Param('id') id: string, @Body() permitionid: AddPermition) {
    return this.adminService.addPermitionToAnRole(id, permitionid)
  }
  @Delete("rolePermition/:id")
  @ApiOperation({ summary: 'Delete some permition of an user(admin only)' })
  deleteSomePermitionOfUser(@Param("id") id: string, @Body() permitionid: AddPermition) {
    return this.adminService.deletePermitionFromRole(id, permitionid)
  }


  //Permitions
  @Get('permition')
  @ApiOperation({ summary: 'Get all permitions (admin only)' })
  getAllPermitions() {
    return this.adminService.findAllPermiotions()
  }

  @Post("permition")
  @ApiOperation({ summary: 'Create a new Permition (admin only)' })
  @ApiResponse({ status: 201, description: 'Permition created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Permition already exists' })
  async createPermition(@Body() creatper: CreatePermitionDto) {
    return this.adminService.creatPermition(creatper)
  }

  @Delete('permition/:id')
  @ApiOperation({ summary: 'Delete Permition by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'Permition ID' })
  @ApiResponse({ status: 200, description: 'Permition deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permition not found' })
  async deletePermition(@Param('id') id: string) {
    return this.adminService.deletePermition(id)
  }

  // USERS
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  getAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by id (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  getUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user by id (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // CATEGORIES
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories (admin only)' })
  getAllCategories() {
    return this.adminService.findAllCategories();
  }

  // PRODUCTS
  @Get('products')
  @ApiOperation({ summary: 'Get all products (admin only)' })
  getAllProducts() {
    return this.adminService.findAllProducts();
  }

  // ORDERS
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  getAllOrders() {
    return this.adminService.findAllOrders();
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by id (admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  getOrderById(@Param('id') id: string) {
    return this.adminService.findOrderById(id);
  }

  // CARTS
  @Get('carts')
  @ApiOperation({ summary: 'Get all carts (admin only)' })
  getAllCarts() {
    return this.adminService.findAllCarts();
  }

  // ADDRESSES
  @Get('addresses')
  @ApiOperation({ summary: 'Get all addresses (admin only)' })
  getAllAddresses() {
    return this.adminService.findAllAddresses();
  }

  // COUPONS
  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons (admin only)' })
  getAllCoupons() {
    return this.adminService.findAllCoupons();
  }

  // PAYMENTS
  @Get('payments')
  @ApiOperation({ summary: 'Get all payments (admin only)' })
  getAllPayments() {
    return this.adminService.findAllPayments();
  }

  // COMMENTS
  @Get('comments')
  @ApiOperation({ summary: 'Get all comments (admin only)' })
  getAllComments() {
    return this.adminService.findAllComments();
  }
}
