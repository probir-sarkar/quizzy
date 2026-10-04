#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/08919b85a5150acb763e400d6c86863c5ad8e48651feac6697047a7677562140/contract';
import startContract from '../../snapshots/08919b85a5150acb763e400d6c86863c5ad8e48651feac6697047a7677562140/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/19eb5373c784bc4fdab6d0241211d5f9b2f3fc0e8669b9464e3bf0a526dd7da7/contract';
import endContract from '../../snapshots/19eb5373c784bc4fdab6d0241211d5f9b2f3fc0e8669b9464e3bf0a526dd7da7/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'Horoscope' }),
      this.dropNativeEnumType({ schema: 'public', typeName: 'ZodiacSign' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
