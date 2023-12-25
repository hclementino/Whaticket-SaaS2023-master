import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey
  } from "sequelize-typescript";
import ContactListItem from "./ContactListItem";
import Company from "./Company";
  
  @Table({ tableName: "CampaignEmail" })
  class Email extends Model<Email> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @Column
    name: string;

    @Column
    from: string;

    @ForeignKey(() => Company)
    @Column
    companyId: number;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;

    @ForeignKey(() => ContactListItem)
    @Column
    userQueuesId: number;
  }
  
  export default Email;
  