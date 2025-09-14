import { AppProviders } from "./provider";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};
