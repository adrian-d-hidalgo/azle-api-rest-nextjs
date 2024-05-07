import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", unique: true })
  username: string;
}
