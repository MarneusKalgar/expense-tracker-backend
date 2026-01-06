import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Account, Currency, Transaction } from "./index.js";

@Entity()
export class User {
  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Currency, currency => currency.user)
  currencies: Currency[];

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

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @UpdateDateColumn()
  updatedAt: Date;
}
