import api from './axios'
import type {
  StudentDashboardData,
  EmployerDashboardData,
} from '../types/dashboard.types'

export const dashboardApi = {
  /** GET /api/dashboard/student */
  getStudentDashboard: () =>
    api.get<StudentDashboardData>('/dashboard/student'),

  /** GET /api/dashboard/employer */
  getEmployerDashboard: () =>
    api.get<EmployerDashboardData>('/dashboard/employer'),
}