import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collaborator, CollaboratorDocument } from '../../schemas/collaborator.schema';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto, UpdateLanguageDto } from './dto/update-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectModel(Collaborator.name) private collaboratorModel: Model<CollaboratorDocument>,
  ) {}

  async create(createCollaboratorDto: CreateCollaboratorDto): Promise<Collaborator> {
    // Check if email already exists
    const existingByEmail = await this.collaboratorModel.findOne({
      email: createCollaboratorDto.email,
    });

    if (existingByEmail) {
      throw new ConflictException('Collaborator with this email already exists');
    }

    // Check if firebaseUid already exists
    const existingByUid = await this.collaboratorModel.findOne({
      firebaseUid: createCollaboratorDto.firebaseUid,
    });

    if (existingByUid) {
      throw new ConflictException('Collaborator with this Firebase UID already exists');
    }

    // If manager is specified, validate they exist and are a manager
    if (createCollaboratorDto.managerId) {
      const manager = await this.collaboratorModel.findById(createCollaboratorDto.managerId);

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      if (manager.role !== 'manager') {
        throw new BadRequestException('Specified manager is not in a manager role');
      }
    }

    const collaborator = new this.collaboratorModel(createCollaboratorDto);
    return collaborator.save();
  }

  async findAll(tenantId?: string): Promise<Collaborator[]> {
    const filter: any = { isActive: true };

    if (tenantId) {
      filter.tenantId = tenantId;
    }

    return this.collaboratorModel
      .find(filter)
      .populate('tenantId', 'name logo')
      .populate('managerId', 'name email')
      .populate('jobRoleId', 'name')
      .populate('departmentId', 'name')
      .exec();
  }

  async findOne(id: string): Promise<Collaborator> {
    const collaborator = await this.collaboratorModel
      .findById(id)
      .populate('tenantId', 'name logo defaultLanguage')
      .populate('managerId', 'name email')
      .populate('jobRoleId', 'name')
      .populate('departmentId', 'name')
      .exec();

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<Collaborator> {
    const collaborator = await this.collaboratorModel
      .findOne({ firebaseUid })
      .populate('tenantId', 'name logo defaultLanguage')
      .populate('managerId', 'name email')
      .exec();

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async findByManager(managerId: string): Promise<Collaborator[]> {
    return this.collaboratorModel
      .find({ managerId, isActive: true })
      .populate('tenantId', 'name logo')
      .exec();
  }

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto): Promise<Collaborator> {
    // If updating managerId, validate the new manager
    if (updateCollaboratorDto.managerId) {
      const manager = await this.collaboratorModel.findById(updateCollaboratorDto.managerId);

      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      if (manager.role !== 'manager') {
        throw new BadRequestException('Specified manager is not in a manager role');
      }
    }

    const collaborator = await this.collaboratorModel
      .findByIdAndUpdate(id, updateCollaboratorDto, { new: true })
      .exec();

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async updateLanguage(id: string, updateLanguageDto: UpdateLanguageDto): Promise<Collaborator> {
    const collaborator = await this.collaboratorModel
      .findByIdAndUpdate(
        id,
        { preferredLanguage: updateLanguageDto.preferredLanguage },
        { new: true },
      )
      .exec();

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return collaborator;
  }

  async remove(id: string): Promise<void> {
    const result = await this.collaboratorModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('Collaborator not found');
    }
  }
}
