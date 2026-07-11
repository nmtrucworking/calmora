import AppRouter from "@app/router/AppRouter";
import { CustomCursor } from "@shared/components/ui/CustomCursor";
import { InquiryBagProvider } from "@app/providers/InquiryBagContext";
import { LanguageProvider } from "@app/providers/LanguageContext";

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
