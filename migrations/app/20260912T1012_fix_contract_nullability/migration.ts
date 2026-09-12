#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/27208118c83d4b950132d6a40ef4f9d4bf13b70dbf4df565a6f2a4fab88cfd9b/contract';
import endContract from '../../snapshots/27208118c83d4b950132d6a40ef4f9d4bf13b70dbf4df565a6f2a4fab88cfd9b/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/cfaab9ad41cee3b1aa70ed2d7d812d7318f9f799805742a0ae451dd49bb4f3aa/contract';
import startContract from '../../snapshots/cfaab9ad41cee3b1aa70ed2d7d812d7318f9f799805742a0ae451dd49bb4f3aa/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'PastEvent', column: 'sourceUrls' }),
      this.dropDefault({ schema: 'public', table: 'PastEvent', column: 'tags' }),
      this.dropNotNull({ schema: 'public', table: 'PastEvent', column: 'sourceUrls' }),
      this.dropNotNull({ schema: 'public', table: 'PastEvent', column: 'tags' }),
      this.dropNotNull({ schema: 'public', table: 'Question', column: 'options' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
