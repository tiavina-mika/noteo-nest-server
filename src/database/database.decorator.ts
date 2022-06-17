import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from './database.constant';

export function DatabaseEntity(
  entity: string,
  connectionName?: string
): (target: Record<string, any>, key: string | symbol, index?: number) => void {
  return InjectModel(entity, connectionName || DATABASE_CONNECTION_NAME);
}
