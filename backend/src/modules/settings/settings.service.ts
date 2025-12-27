import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobRole, JobRoleDocument } from '../../schemas/job-role.schema';
import { Department, DepartmentDocument } from '../../schemas/department.schema';
import { CreateJobRoleDto, UpdateJobRoleDto } from './dto/job-role.dto';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(JobRole.name) private jobRoleModel: Model<JobRoleDocument>,
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
  ) {}

  // ==================== JOB ROLES ====================

  async createJobRole(createJobRoleDto: CreateJobRoleDto): Promise<JobRole> {
    const existing = await this.jobRoleModel.findOne({
      tenantId: createJobRoleDto.tenantId,
      name: createJobRoleDto.name,
    });

    if (existing) {
      throw new ConflictException('Job role with this name already exists');
    }

    const jobRole = new this.jobRoleModel(createJobRoleDto);
    return jobRole.save();
  }

  async findAllJobRoles(tenantId: string): Promise<JobRole[]> {
    return this.jobRoleModel
      .find({ tenantId, isActive: true })
      .sort({ name: 1 })
      .exec();
  }

  async findOneJobRole(id: string): Promise<JobRole> {
    const jobRole = await this.jobRoleModel.findById(id).exec();

    if (!jobRole) {
      throw new NotFoundException('Job role not found');
    }

    return jobRole;
  }

  async updateJobRole(id: string, updateJobRoleDto: UpdateJobRoleDto): Promise<JobRole> {
    const jobRole = await this.jobRoleModel
      .findByIdAndUpdate(id, updateJobRoleDto, { new: true })
      .exec();

    if (!jobRole) {
      throw new NotFoundException('Job role not found');
    }

    return jobRole;
  }

  async deleteJobRole(id: string): Promise<void> {
    const result = await this.jobRoleModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Job role not found');
    }
  }

  // ==================== DEPARTMENTS ====================

  async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentModel.findOne({
      tenantId: createDepartmentDto.tenantId,
      name: createDepartmentDto.name,
    });

    if (existing) {
      throw new ConflictException('Department with this name already exists');
    }

    const department = new this.departmentModel(createDepartmentDto);
    return department.save();
  }

  async findAllDepartments(tenantId: string): Promise<Department[]> {
    return this.departmentModel
      .find({ tenantId, isActive: true })
      .populate('managerId', 'name email')
      .sort({ name: 1 })
      .exec();
  }

  async findOneDepartment(id: string): Promise<Department> {
    const department = await this.departmentModel
      .findById(id)
      .populate('managerId', 'name email')
      .exec();

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true })
      .populate('managerId', 'name email')
      .exec();

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async deleteDepartment(id: string): Promise<void> {
    const result = await this.departmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Department not found');
    }
  }
}
