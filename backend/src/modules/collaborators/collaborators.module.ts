import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';
import { Collaborator, CollaboratorSchema } from '../../schemas/collaborator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collaborator.name, schema: CollaboratorSchema }]),
  ],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
