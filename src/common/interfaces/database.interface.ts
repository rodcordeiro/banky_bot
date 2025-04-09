type DateProperties = 'createdAt' | 'updatedAt' | 'deletedAt';

export type Model<Entity, EnableID = false> = EnableID extends true
  ? {
      [k in keyof Omit<Entity, DateProperties>]?: Entity[k];
    }
  : {
      [k in keyof Omit<Entity, 'id' | DateProperties>]?: Entity[k];
    };
