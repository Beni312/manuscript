import { BaseModel } from "./BaseModel";
import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { User } from "./User";

@Table
export class Conference extends BaseModel<Conference> {

    @Column(DataType.STRING)
    title: string;

    @Column(DataType.STRING)
    description: string;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    submitterId: number;

    @BelongsTo(() => User)
    submitter?: User;
}
