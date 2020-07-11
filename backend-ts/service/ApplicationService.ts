import { inject, injectable } from 'inversify';
import { AcademicDiscipline } from '../model';
import { AcademicDisciplineDto } from '../model/dto/AcademicDisciplineDto';
import { AcademicDisciplineRepository } from '../repository/AcademicDisciplineRepository';
import { RoleDto } from '../model/dto/RoleDto';
import { RoleRepository } from '../repository/RoleRepository';
import { SystemDataDto } from '../model/response/SystemDataDto';

@injectable()
export class ApplicationService {

  @inject(AcademicDisciplineRepository.name)
  private academicDisciplineRepository: AcademicDisciplineRepository;

  @inject(RoleRepository.name)
  private roleRepository: RoleRepository;

  public async getAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return await this.academicDisciplineRepository.findAll();
  }

  public async getSystemData(): Promise<SystemDataDto> {
    const academicDisciplines = await this.academicDisciplineRepository.findAll();
    const roles = await this.roleRepository.findAll();

    return new SystemDataDto(
      academicDisciplines.map(a => new AcademicDisciplineDto(a.id, a.name)),
      roles.map(r => new RoleDto(r.id, r.name))
    );
  }
}
