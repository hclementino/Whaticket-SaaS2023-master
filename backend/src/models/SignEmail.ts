import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey
  } from "sequelize-typescript";
import Company from "./Company";
  
  @Table({ tableName: "DkimMail" })
  class SignEmail extends Model<SignEmail> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    publicKey: string;

    @Column
    privateKey: string;

    @Column
    dkim: string;

    @ForeignKey(() => Company)
    @Column
    companyId: number;
  
    @CreatedAt
    createdAt: Date;
  }
  
  export default SignEmail;
  