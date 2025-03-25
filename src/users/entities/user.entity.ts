import { BaseEntity } from '@src/shared/database/base.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { UrlEntity } from '@src/url/entities/url.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 44, nullable: false })
  name: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ name: 'phone_number', type: 'varchar', nullable: false })
  phoneNumber: string;

  @OneToMany(() => UrlEntity, (url) => url.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'urls' })
  urls?: UrlEntity[];
}
