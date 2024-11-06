import { literal } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Item extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public country!: string;

  @Column({
    type: DataType.DATE,
  })
  public birthdata!: string;

  @Column({
    type: DataType.INTEGER,
  })
  public money!: string;
}
