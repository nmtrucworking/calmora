import AppRouter from "@app/router/AppRouter";
import { InquiryBagProvider } from "@app/providers/InquiryBagContext";
import { LanguageProvider } from "@app/providers/LanguageContext";
import { ProductCatalogProvider } from "@app/providers/ProductCatalogContext";

export default function App() {
  return (
    <LanguageProvider>
      <ProductCatalogProvider>
        <InquiryBagProvider>
          <AppRouter />
        </InquiryBagProvider>
      </ProductCatalogProvider>
    </LanguageProvider>
  );
}
