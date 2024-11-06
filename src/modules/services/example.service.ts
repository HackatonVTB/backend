import { throwErrorNotFound } from 'core/utils/error';
import { Item } from 'database/postgres/models/final/item.model';
import { ExamplePatchType, ExamplePostType } from 'modules/dto/example.dto';

export const ExampleService = {
  getItems: async () => {
    return await Item.findAll();
  },
  getItemById: async (id: string) => {
    const item = await Item.findByPk(id);

    if (!item) {
      throwErrorNotFound(`Item with id# ${id} was not found`);
    }

    return item;
  },
  createItem: async (dto: ExamplePostType) => {
    const item = await Item.create({ ...dto });

    return item;
  },
  updateItem: async (id: string, dto: ExamplePatchType) => {
    const item = await ExampleService.getItemById(id);

    await item.update(dto);

    return item;
  },
  deleteItem: async (id: string) => {
    const item = await ExampleService.getItemById(id);

    await item.destroy();
  },
};
