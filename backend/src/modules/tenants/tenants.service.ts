import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../../schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantModel.findOne({
      name: createTenantDto.name,
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this name already exists');
    }

    const tenant = new this.tenantModel(createTenantDto);
    return tenant.save();
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id).exec();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantModel
      .findByIdAndUpdate(id, updateTenantDto, { new: true })
      .exec();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tenantModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Tenant not found');
    }
  }
}
