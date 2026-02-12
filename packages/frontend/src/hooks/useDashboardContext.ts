import { useOutletContext } from 'react-router-dom';

interface DashboardContext {
  currentOrgId: string;
}

export const useDashboardContext = (): DashboardContext =>
  useOutletContext<DashboardContext>();
