import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Account, Category, User } from "./index.js";

export enum TransactionType {
  EXPENSE = "expense",
  INCOME = "income",
  TRANSFER = "transfer",
}

@Entity()
@Index(["userId", "date"])
@Index(["userId", "accountId"])
@Index(["userId", "categoryId"])
export class Transaction {
  @JoinColumn({ name: "account_id" })
  @ManyToOne(() => Account, account => account.transactions, { nullable: false })
  account: Account;

  @Column({ name: "account_id", type: "uuid" })
  @Index()
  accountId: string;

  @Column({
    nullable: false,
    precision: 10,
    scale: 2,
    type: "decimal",
  })
  amount: number;

  @JoinColumn({ name: "category_id" })
  @ManyToOne(() => Category, category => category.transactions, { nullable: false })
  category: Category;

  @Column({ name: "category_id", type: "uuid" })
  @Index()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false, type: "date" })
  date: Date;

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
    enum: TransactionType,
    nullable: false,
    type: "enum",
  })
  type: TransactionType;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, user => user.transactions, { nullable: false })
  user: User;

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string;
}
