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

import { Currency, Transaction, User } from "./index.js";

@Entity()
export class Account {
  @Column({
    default: 0,
    nullable: false,
    precision: 10,
    scale: 2,
    type: "decimal",
  })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @JoinColumn({ name: "currency_id" })
  @ManyToOne(() => Currency, currency => currency.accounts, { nullable: false })
  currency: Currency;

  @Column({ name: "currency_id", type: "uuid" })
  currencyId: string;

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

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, user => user.accounts, { nullable: false })
  user: User;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;
}
