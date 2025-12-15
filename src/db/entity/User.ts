import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ length: 255, nullable: false, type: "varchar", unique: true })
  email: string;

  @Column({
    length: 100,
    nullable: false,
    type: "varchar",
  })
  firstName: string;

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 100,
    nullable: false,
    type: "varchar",
  })
  lastName: string;

  @Column({
    length: 60,
    nullable: false,
    select: false, // Exclude password from queries by default
    type: "varchar",
  })
  password: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
