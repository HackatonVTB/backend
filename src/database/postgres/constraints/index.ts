import { AddConstraintOptions, QueryInterfaceOptions } from 'sequelize';

type ConstraintAddType = {
  tableName: string;
  options: AddConstraintOptions & QueryInterfaceOptions;
};

export function pgConstraintList(): ConstraintAddType[] {
  return [];
}
