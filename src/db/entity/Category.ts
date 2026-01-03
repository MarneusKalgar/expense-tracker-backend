import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Transaction } from "./index.js";

export enum CategoryType {
  EXPENSE = "expense",
  INCOME = "income",
}

@Entity()
export class Category {
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

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];

  @Column({
    enum: CategoryType,
    nullable: false,
    type: "enum",
  })
  type: CategoryType;

  @UpdateDateColumn()
  updatedAt: Date;
}
