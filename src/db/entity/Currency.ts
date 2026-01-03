import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Account, User } from "./index.js";

@Entity()
export class Currency {
  @OneToMany(() => Account, account => account.currency)
  accounts: Account[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 100,
    nullable: false,
    type: "varchar",
  })
  name: string;

  @Column({
    default: 2,
    nullable: false,
    type: "int",
  })
  precision: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, user => user.currencies, { nullable: false })
  user: User;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;
}
