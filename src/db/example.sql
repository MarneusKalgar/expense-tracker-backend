CREATE TABLE "user" (
    "id" int   NOT NULL,
    "firstName" varchar(100)   NOT NULL,
    "lastName" varchar(100)   NOT NULL,
    "password" varchar(60)   NOT NULL,
    "email" varchar(255)   NOT NULL,
    "transaction_id" int   NOT NULL,
    "account_id" int   NOT NULL,
    "curency_id" int   NOT NULL,
    CONSTRAINT "pk_user" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "transaction" (
    "id" int   NOT NULL,
    "name" varchar(100)   NOT NULL,
    "type" enum('expense','income','transfer')   NOT NULL,
    "amount" decimal(10,2)   NOT NULL,
    "user_id" int   NOT NULL,
    "category_id" int   NOT NULL,
    CONSTRAINT "pk_transaction" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "account" (
    "id" int   NOT NULL,
    "name" varchar(100)   NOT NULL,
    "balance" decimal(10,2)   NOT NULL,
    "user_id" int   NOT NULL,
    CONSTRAINT "pk_account" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "currency" (
    "id" int   NOT NULL,
    "name" varchar(100)   NOT NULL,
    "precision" decimal(10,2)   NOT NULL,
    "user_id" int   NOT NULL,
    CONSTRAINT "pk_currency" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "category" (
    "id" int   NOT NULL,
    "name" varchar(100)   NOT NULL,
    "type" enum('expense','income')   NOT NULL,
    "transaction_id" int   NOT NULL,
    CONSTRAINT "pk_category" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "user" ADD CONSTRAINT "fk_user_transaction_id" FOREIGN KEY("transaction_id")
REFERENCES "transaction" ("user_id");

ALTER TABLE "user" ADD CONSTRAINT "fk_user_account_id" FOREIGN KEY("account_id")
REFERENCES "account" ("user_id");

ALTER TABLE "user" ADD CONSTRAINT "fk_user_curency_id" FOREIGN KEY("curency_id")
REFERENCES "currency" ("user_id");

ALTER TABLE "transaction" ADD CONSTRAINT "fk_transaction_category_id" FOREIGN KEY("category_id")
REFERENCES "category" ("transaction_id");

