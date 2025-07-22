import { query } from '@/config/database';
import { PaginationQuery, SortQuery } from '@/types';

export abstract class BaseModel {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findById<T>(id: number): Promise<T | null> {
    const result = await query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result[0] ?? null;
  }

  async findAll<T>(options?: PaginationQuery & SortQuery): Promise<T[]> {
    let queryText = `SELECT * FROM ${this.tableName}`;
    const params: unknown[] = [];
    let paramIndex = 1;

    // Add sorting
    if (options?.sort_by) {
      const order = options.order ?? 'asc';
      queryText += ` ORDER BY ${options.sort_by} ${order.toUpperCase()}`;
    }

    // Add pagination
    if (options?.limit) {
      queryText += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;
    }

    if (options?.page && options?.limit) {
      const offset = (options.page - 1) * options.limit;
      queryText += ` OFFSET $${paramIndex}`;
      params.push(offset);
    }

    return await query<T>(queryText, params);
  }

  async create<T>(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const queryText = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await query<T>(queryText, values);
    return result[0]!;
  }

  async update<T>(id: number, data: Partial<T>): Promise<T | null> {
    const entries = Object.entries(data).filter(
      ([, value]) => value !== undefined
    );
    if (entries.length === 0) {
      return this.findById<T>(id);
    }

    const columns = entries
      .map(([key], index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = entries.map(([, value]) => value);

    const queryText = `
      UPDATE ${this.tableName}
      SET ${columns}
      WHERE id = $1
      RETURNING *
    `;

    const result = await query<T>(queryText, [id, ...values]);
    return result[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM ${this.tableName} WHERE id = $1`, [
      id,
    ]);
    return result.length > 0;
  }

  async count(whereClause?: string, params?: unknown[]): Promise<number> {
    let queryText = `SELECT COUNT(*) as count FROM ${this.tableName}`;

    if (whereClause) {
      queryText += ` WHERE ${whereClause}`;
    }

    const result = await query<{ count: string }>(queryText, params);
    return parseInt(result[0]?.count ?? '0');
  }

  async exists(id: number): Promise<boolean> {
    const result = await query(
      `SELECT 1 FROM ${this.tableName} WHERE id = $1 LIMIT 1`,
      [id]
    );
    return result.length > 0;
  }

  protected buildWhereClause(filters: Record<string, unknown>): {
    clause: string;
    params: unknown[];
  } {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          const placeholders = value.map(() => `$${paramIndex++}`).join(', ');
          conditions.push(`${key} IN (${placeholders})`);
          params.push(...(value as unknown[]));
        } else {
          conditions.push(`${key} = $${paramIndex++}`);
          params.push(value);
        }
      }
    }

    return {
      clause: conditions.length > 0 ? conditions.join(' AND ') : '',
      params,
    };
  }
}
