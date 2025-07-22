import { BaseModel } from './BaseModel';
import {
  AIApp,
  AIAppWithDetails,
  CreateAIAppRequest,
  AppListQuery,
  Tag,
  ReviewWithUser,
  AppStatus,
  CategoryType,
} from '@/types';
import { query } from '@/config/database';

interface DatabaseRow {
  id: number;
  name: string;
  description: string;
  category_id: number;
  creator_id: number;
  status: string;
  url?: string;
  api_endpoint?: string;
  api_key?: string;
  tech_stack?: Record<string, unknown>;
  usage_guide?: string;
  input_example?: string;
  output_example?: string;
  model_info?: string;
  environment?: string;
  usage_count: number;
  avg_rating?: number | null;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  category_name?: string;
  category_description?: string;
  category_type?: string;
  category_color?: string;
  creator_name?: string;
  creator_email?: string;
  favorites_count?: string;
  is_favorited?: boolean;
}

export class AIAppModel extends BaseModel {
  constructor() {
    super('ai_apps');
  }

  async findWithDetails(
    id: number,
    userId?: number
  ): Promise<AIAppWithDetails | null> {
    const queryText = `
      SELECT 
        a.*,
        c.name as category_name,
        c.type as category_type,
        c.color as category_color,
        u.name as creator_name,
        u.email as creator_email,
        COALESCE(f_count.count, 0) as favorites_count,
        CASE WHEN uf.user_id IS NOT NULL THEN true ELSE false END as is_favorited
      FROM ai_apps a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.creator_id = u.id
      LEFT JOIN (
        SELECT app_id, COUNT(*) as count 
        FROM favorites 
        GROUP BY app_id
      ) f_count ON a.id = f_count.app_id
      LEFT JOIN favorites uf ON a.id = uf.app_id AND uf.user_id = $2
      WHERE a.id = $1
    `;

    const result = await query<AIAppWithDetails>(queryText, [id, userId ?? null]);
    if (!result[0]) return null;

    const app = result[0];
    return this.mapToAppWithDetails(app as unknown as DatabaseRow);
  }

  async findAllWithFilters(
    filters: AppListQuery,
    userId?: number
  ): Promise<AIAppWithDetails[]> {
    let queryText = `
      SELECT 
        a.*,
        c.name as category_name,
        c.type as category_type,
        c.color as category_color,
        u.name as creator_name,
        COALESCE(f_count.count, 0) as favorites_count,
        CASE WHEN uf.user_id IS NOT NULL THEN true ELSE false END as is_favorited
      FROM ai_apps a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.creator_id = u.id
      LEFT JOIN (
        SELECT app_id, COUNT(*) as count 
        FROM favorites 
        GROUP BY app_id
      ) f_count ON a.id = f_count.app_id
      LEFT JOIN favorites uf ON a.id = uf.app_id AND uf.user_id = $1
    `;

    const params: unknown[] = [userId ?? null];
    let paramIndex = 2;

    // Build WHERE clause
    const conditions: string[] = [];

    if (filters.q) {
      conditions.push(
        `(a.name ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`
      );
      params.push(`%${filters.q}%`);
      paramIndex++;
    }

    if (filters.category_id) {
      conditions.push(`a.category_id = $${paramIndex}`);
      params.push(filters.category_id);
      paramIndex++;
    }

    if (filters.status) {
      conditions.push(`a.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.is_public !== undefined) {
      conditions.push(`a.is_public = $${paramIndex}`);
      params.push(filters.is_public);
      paramIndex++;
    }

    if (filters.creator_id) {
      conditions.push(`a.creator_id = $${paramIndex}`);
      params.push(filters.creator_id);
      paramIndex++;
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagPlaceholders = filters.tags
        .map(() => `$${paramIndex++}`)
        .join(', ');
      queryText += ` 
        INNER JOIN app_tags at ON a.id = at.app_id 
        INNER JOIN tags t ON at.tag_id = t.id
      `;
      conditions.push(`t.id IN (${tagPlaceholders})`);
      params.push(...filters.tags);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add sorting
    const sortBy = filters.sort_by ?? 'created_at';
    const order = filters.order ?? 'desc';
    queryText += ` ORDER BY a.${sortBy} ${order.toUpperCase()}`;

    // Add pagination
    if (filters.limit) {
      queryText += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters.page && filters.limit) {
      const offset = (filters.page - 1) * filters.limit;
      queryText += ` OFFSET $${paramIndex}`;
      params.push(offset);
    }

    const result = await query<AIAppWithDetails>(queryText, params);
    return result.map(app => this.mapToAppWithDetails(app as unknown as DatabaseRow));
  }

  async createWithCreator(
    data: CreateAIAppRequest,
    creatorId: number
  ): Promise<AIApp> {
    const createData = { ...data, creator_id: creatorId };
    return await this.create<AIApp>(createData);
  }

  async getTagsByAppId(appId: number): Promise<Tag[]> {
    const queryText = `
      SELECT t.* 
      FROM tags t
      INNER JOIN app_tags at ON t.id = at.tag_id
      WHERE at.app_id = $1
      ORDER BY t.name
    `;
    return await query<Tag>(queryText, [appId]);
  }

  async getReviewsByAppId(appId: number, limit = 10): Promise<ReviewWithUser[]> {
    const queryText = `
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.app_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2
    `;
    return await query<ReviewWithUser>(queryText, [appId, limit]);
  }

  async addTagToApp(appId: number, tagId: number): Promise<void> {
    await query(
      'INSERT INTO app_tags (app_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [appId, tagId]
    );
  }

  async removeTagFromApp(appId: number, tagId: number): Promise<void> {
    await query('DELETE FROM app_tags WHERE app_id = $1 AND tag_id = $2', [
      appId,
      tagId,
    ]);
  }

  async incrementUsageCount(appId: number): Promise<void> {
    await query(
      'UPDATE ai_apps SET usage_count = usage_count + 1 WHERE id = $1',
      [appId]
    );
  }

  async getPopularApps(limit = 10): Promise<AIApp[]> {
    const queryText = `
      SELECT * FROM ai_apps
      WHERE is_public = true AND status = 'active'
      ORDER BY usage_count DESC, avg_rating DESC NULLS LAST
      LIMIT $1
    `;
    return await query<AIApp>(queryText, [limit]);
  }

  async getRecentApps(limit = 10): Promise<AIApp[]> {
    const queryText = `
      SELECT * FROM ai_apps
      WHERE is_public = true AND status = 'active'
      ORDER BY created_at DESC
      LIMIT $1
    `;
    return await query<AIApp>(queryText, [limit]);
  }

  async searchApps(searchTerm: string, limit = 20): Promise<AIApp[]> {
    const queryText = `
      SELECT *, 
             ts_rank(to_tsvector('english', name || ' ' || description), plainto_tsquery('english', $1)) as rank
      FROM ai_apps
      WHERE to_tsvector('english', name || ' ' || description) @@ plainto_tsquery('english', $1)
        AND is_public = true 
        AND status = 'active'
      ORDER BY rank DESC, usage_count DESC
      LIMIT $2
    `;
    return await query<AIApp>(queryText, [searchTerm, limit]);
  }

  private mapToAppWithDetails(row: DatabaseRow): AIAppWithDetails {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category_id: row.category_id,
      creator_id: row.creator_id,
      status: row.status as AppStatus,
      url: row.url ?? '',
      api_endpoint: row.api_endpoint ?? '',
      api_key: row.api_key ?? '',
      tech_stack: row.tech_stack ?? {},
      usage_guide: row.usage_guide ?? '',
      input_example: row.input_example ?? '',
      output_example: row.output_example ?? '',
      model_info: row.model_info ?? '',
      environment: row.environment ?? '',
      usage_count: row.usage_count,
      avg_rating: row.avg_rating ? parseFloat(row.avg_rating.toString()) : null,
      is_public: row.is_public,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_name
        ? {
            id: row.category_id,
            name: row.category_name,
            type: row.category_type as CategoryType,
            color: row.category_color ?? '',
            created_at: new Date(),
            updated_at: new Date(),
          }
        : undefined,
      creator: row.creator_name
        ? {
            id: row.creator_id,
            name: row.creator_name,
            email: row.creator_email ?? '',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date(),
          }
        : undefined,
      favorites_count: parseInt(row.favorites_count ?? '0') ?? 0,
      is_favorited: row.is_favorited ?? false,
    };
  }
}
