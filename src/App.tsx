import AppRouter from "./routes/AppRouter";
import { CustomCursor } from "./components/ui/CustomCursor";

export default function App() {
  return (
    <>
      <CustomCursor />
      <AppRouter />
    </>
  );
}

