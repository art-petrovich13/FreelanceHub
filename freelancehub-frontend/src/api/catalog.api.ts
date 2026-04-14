import api from './axios'
import type { Category, Skill } from '../types/catalog.types'

/**
 * Функции для получения справочных данных:
 * категорий и навыков — используются в формах создания услуг и заказов.
 */
export const catalogApi = {
  /**
   * GET /api/categories
   * Все категории (для дропдауна в форме).
   */
  getCategories: () =>
    api.get<Category[]>('/categories'),

  /**
   * GET /api/skills
   * Все навыки (для мультиселекта в форме).
   */
  getSkills: () =>
    api.get<Skill[]>('/skills'),
}