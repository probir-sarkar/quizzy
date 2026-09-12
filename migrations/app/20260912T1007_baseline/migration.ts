#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/cfaab9ad41cee3b1aa70ed2d7d812d7318f9f799805742a0ae451dd49bb4f3aa/contract';
import endContract from '../../snapshots/cfaab9ad41cee3b1aa70ed2d7d812d7318f9f799805742a0ae451dd49bb4f3aa/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'EventCategory',
        members: [
          'war',
          'discovery',
          'politics',
          'science',
          'art',
          'sports',
          'technology',
          'medicine',
          'exploration',
          'literature',
          'music',
          'economy',
          'religion',
          'disaster',
          'revolution',
          'invention',
        ],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'QuizDifficulty',
        members: ['easy', 'medium', 'hard'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'ZodiacSign',
        members: [
          'ARIES',
          'TAURUS',
          'GEMINI',
          'CANCER',
          'LEO',
          'VIRGO',
          'LIBRA',
          'SCORPIO',
          'SAGITTARIUS',
          'CAPRICORN',
          'AQUARIUS',
          'PISCES',
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'Category_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Horoscope',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('date', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('luckyColor', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('luckyNumber', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('mood', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('zodiacSign', '"ZodiacSign"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'ZodiacSign' } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'Horoscope_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'PastEvent',
        columns: [
          col('category', '"EventCategory"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'EventCategory' } },
          }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('day', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('eventDate', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isPublished', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('metadata', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('month', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sourceUrls', 'text[]', {
            notNull: true,
            default: lit([]),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('tags', 'text[]', {
            notNull: true,
            default: lit([]),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'PastEvent_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Question',
        columns: [
          col('correctIndex', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('explanation', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('options', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('quizId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'Question_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Quiz',
        columns: [
          col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('difficulty', '"QuizDifficulty"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'QuizDifficulty' } },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isPublished', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('publishedAt', 'timestamp(3)', {
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('quizPageDescription', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizPageTitle', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('subCategoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('views', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'Quiz_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'QuizTag',
        columns: [
          col('quizId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['quizId', 'tagId'], { name: 'QuizTag_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'SubCategory',
        columns: [
          col('categoryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'SubCategory_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'Tag',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'Tag_pkey' })],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_createdAt_idx',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_name_key',
        columns: ['name'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_slug_idx',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Category',
        index: 'Category_slug_key',
        columns: ['slug'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Horoscope',
        index: 'Horoscope_date_idx',
        columns: ['date'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Horoscope',
        index: 'Horoscope_zodiacSign_date_key',
        columns: ['zodiacSign', 'date'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_category_idx',
        columns: ['category'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_eventDate_idx',
        columns: ['eventDate'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_month_day_category_idx',
        columns: ['month', 'day', 'category'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_month_day_idx',
        columns: ['month', 'day'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_month_day_year_slug_key',
        columns: ['month', 'day', 'year', 'slug'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'PastEvent',
        index: 'PastEvent_slug_idx',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Question',
        index: 'Question_quizId_idx',
        columns: ['quizId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_createdAt_idx',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_difficulty_idx',
        columns: ['difficulty'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_isPublished_idx',
        columns: ['isPublished'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_quizPageTitle_key',
        columns: ['quizPageTitle'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_slug_idx',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_slug_key',
        columns: ['slug'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizTag',
        index: 'QuizTag_quizId_idx',
        columns: ['quizId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SubCategory',
        index: 'SubCategory_categoryId_idx',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SubCategory',
        index: 'SubCategory_categoryId_name_key',
        columns: ['categoryId', 'name'],
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'SubCategory',
        index: 'SubCategory_slug_idx',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Tag',
        index: 'Tag_name_idx',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Tag',
        index: 'Tag_name_key',
        columns: ['name'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Question',
        foreignKey: {
          name: 'Question_quizId_fkey',
          columns: ['quizId'],
          references: { schema: 'public', table: 'Quiz', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'setNull',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_subCategoryId_fkey',
          columns: ['subCategoryId'],
          references: { schema: 'public', table: 'SubCategory', columns: ['id'] },
          onDelete: 'setNull',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizTag',
        foreignKey: {
          name: 'QuizTag_quizId_fkey',
          columns: ['quizId'],
          references: { schema: 'public', table: 'Quiz', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizTag',
        foreignKey: {
          name: 'QuizTag_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SubCategory',
        foreignKey: {
          name: 'SubCategory_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
