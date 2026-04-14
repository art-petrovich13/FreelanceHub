import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn:  () => dashboardApi.getStudentDashboard().then(r => r.data),
    staleTime: 1000 * 60,
  })
}

export function useEmployerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'employer'],
    queryFn:  () => dashboardApi.getEmployerDashboard().then(r => r.data),
    staleTime: 1000 * 60,
  })
}