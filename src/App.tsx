import AppRouter from "./routes/AppRouter";
import { CustomCursor } from "./components/ui/CustomCursor";
import { InquiryBagProvider } from "./contexts/InquiryBagContext";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <>
      <CustomCursor />
      <LanguageProvider>
        <InquiryBagProvider>
          <AppRouter />
        </InquiryBagProvider>
      </LanguageProvider>
    </>
  );
}
