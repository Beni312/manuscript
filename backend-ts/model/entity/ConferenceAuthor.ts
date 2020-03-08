// import { BaseModel } from './BaseModel';
// import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
// import { Conference } from './Conference';
// import { User } from './User';
//
// @Table({
//   modelName: 'conference_author'
// })
// export class ConferenceAuthor extends BaseModel<ConferenceAuthor> {
//
//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.INTEGER,
//     field: 'author_id'
//   })
//   authorId: number;
//
//   @ForeignKey(() => Conference)
//   @Column({
//     type: DataType.INTEGER,
//     field: 'conference_id'
//   })
//   conferenceId: number;
//
//   @BelongsTo(() => User)
//   author: User;
// }
