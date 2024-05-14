import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false, unique: true, readonly: true })
  principal: string;

  @Column({ type: "text", nullable: false, unique: true })
  username: string;

  @Column({ type: "text", nullable: false, unique: true })
  bio: string;
}
