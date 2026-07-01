import AppRouter from "./routes/AppRouter";
import { CustomCursor } from "./components/ui/CustomCursor";
import { InquiryBagProvider } from "./contexts/InquiryBagContext";

export default function App() {
  return (
    <>
      <CustomCursor />
      <InquiryBagProvider>
        <AppRouter />
      </InquiryBagProvider>
    </>
  );
}
