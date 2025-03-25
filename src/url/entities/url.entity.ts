import { BaseEntity } from '@src/shared/database/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '@src/users/entities/user.entity';

@Entity('url')
export class UrlEntity extends BaseEntity {
  @Column({ name: 'url', type: 'varchar', length: 44, nullable: false })
  url: string;

  @Column({ name: 'shortKey', type: 'varchar', nullable: false })
  shortKey: string;

  @Column({ name: 'visits', type: 'integer', default: 0 })
  visits: number;

  @ManyToOne(() => UsersEntity, (user) => user.urls)
  @JoinColumn({ name: 'user' })
  user: UsersEntity;
}
