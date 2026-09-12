#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/08919b85a5150acb763e400d6c86863c5ad8e48651feac6697047a7677562140/contract';
import endContract from '../../snapshots/08919b85a5150acb763e400d6c86863c5ad8e48651feac6697047a7677562140/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/27208118c83d4b950132d6a40ef4f9d4bf13b70dbf4df565a6f2a4fab88cfd9b/contract';
import startContract from '../../snapshots/27208118c83d4b950132d6a40ef4f9d4bf13b70dbf4df565a6f2a4fab88cfd9b/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropIndex({ schema: 'public', table: 'Category', index: 'Category_name_key' }),
      this.dropIndex({ schema: 'public', table: 'Category', index: 'Category_slug_key' }),
      this.dropIndex({
        schema: 'public',
        table: 'Horoscope',
        index: 'Horoscope_zodiacSign_date_key',
      }),
      this.dropIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_month_day_year_slug_key',
      }),
      this.dropIndex({ schema: 'public', table: 'Quiz', index: 'Quiz_quizPageTitle_key' }),
      this.dropIndex({ schema: 'public', table: 'Quiz', index: 'Quiz_slug_key' }),
      this.dropIndex({
        schema: 'public',
        table: 'SubCategory',
        index: 'SubCategory_categoryId_name_key',
      }),
      this.dropIndex({ schema: 'public', table: 'Tag', index: 'Tag_name_key' }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Horoscope',
        constraint: 'Horoscope_zodiacSign_date_key',
        columns: ['zodiacSign', 'date'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'PastEvent',
        constraint: 'PastEvent_month_day_year_slug_key',
        columns: ['month', 'day', 'year', 'slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Quiz',
        constraint: 'Quiz_quizPageTitle_key',
        columns: ['quizPageTitle'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Quiz',
        constraint: 'Quiz_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'SubCategory',
        constraint: 'SubCategory_categoryId_name_key',
        columns: ['categoryId', 'name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Tag',
        constraint: 'Tag_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_subCategoryId_idx_71e8c282',
        columns: ['subCategoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizTag',
        index: 'QuizTag_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Category',
        from: 'Category_createdAt_idx',
        to: 'Category_createdAt_idx_9575dbd7',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Category',
        from: 'Category_slug_idx',
        to: 'Category_slug_idx_73b7f5ce',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Horoscope',
        from: 'Horoscope_date_idx',
        to: 'Horoscope_date_idx_b4ca319c',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'PastEvent',
        from: 'PastEvent_category_idx',
        to: 'PastEvent_category_idx_f2600f8e',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'PastEvent',
        from: 'PastEvent_eventDate_idx',
        to: 'PastEvent_eventDate_idx_8134b017',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'PastEvent',
        from: 'PastEvent_month_day_category_idx',
        to: 'PastEvent_month_day_category_idx_c66dc670',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'PastEvent',
        from: 'PastEvent_month_day_idx',
        to: 'PastEvent_month_day_idx_44d0fed4',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'PastEvent',
        from: 'PastEvent_slug_idx',
        to: 'PastEvent_slug_idx_73b7f5ce',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Question',
        from: 'Question_quizId_idx',
        to: 'Question_quizId_idx_c721979c',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'QuizTag',
        from: 'QuizTag_quizId_idx',
        to: 'QuizTag_quizId_idx_c721979c',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Quiz',
        from: 'Quiz_createdAt_idx',
        to: 'Quiz_createdAt_idx_9575dbd7',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Quiz',
        from: 'Quiz_difficulty_idx',
        to: 'Quiz_difficulty_idx_ab7b4a75',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Quiz',
        from: 'Quiz_isPublished_idx',
        to: 'Quiz_isPublished_idx_d7ee5985',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Quiz',
        from: 'Quiz_slug_idx',
        to: 'Quiz_slug_idx_73b7f5ce',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'SubCategory',
        from: 'SubCategory_categoryId_idx',
        to: 'SubCategory_categoryId_idx_15c304f2',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'SubCategory',
        from: 'SubCategory_slug_idx',
        to: 'SubCategory_slug_idx_73b7f5ce',
      }),
      this.renameIndex({
        schema: 'public',
        table: 'Tag',
        from: 'Tag_name_idx',
        to: 'Tag_name_idx_ce87e6ba',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
