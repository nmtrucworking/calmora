import AppRouter from "@app/router/AppRouter";
import { InquiryBagProvider } from "@app/providers/InquiryBagContext";
import { LanguageProvider } from "@app/providers/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <InquiryBagProvider>
        <AppRouter />
      </InquiryBagProvider>
    </LanguageProvider>
  );
}
