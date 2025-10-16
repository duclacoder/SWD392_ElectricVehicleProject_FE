import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProviders } from "./provider";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <AppProviders>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppRoutes />
      </GoogleOAuthProvider>
    </AppProviders>
  );
};
