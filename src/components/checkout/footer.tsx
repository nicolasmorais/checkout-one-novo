
"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { getFooterData, FooterData } from "@/services/footer-service";

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadData = () => {
      setFooterData(getFooterData());
    };

    loadData();

    // Listen for storage changes to update in real-time
    window.addEventListener('storage', loadData);
    window.addEventListener('footerChanged', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('footerChanged', loadData);
    };
  }, []);

  if (!footerData) {
    return (
      <footer className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8">
        <div className="container mx-auto px-4 max-w-md text-center">
            <div className="h-24"></div> {/* Placeholder for height */}
        </div>
      </footer>
    );
  }

  const {
    securePurchaseTitle,
    protectedDataTitle,
    companyName,
    cnpj,
    address,
    contactEmail,
    copyright,
    termsUrl,
    privacyUrl
  } = footerData;

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8">
      <div className="container mx-auto px-4 max-w-md text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          {securePurchaseTitle && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{securePurchaseTitle}</span>
            </div>
          )}
          {protectedDataTitle && (
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{protectedDataTitle}</span>
            </div>
          )}
        </div>
        <div className="text-xs space-y-1">
          {companyName && <p><strong>Nome da Empresa:</strong> {companyName}</p>}
          {cnpj && <p><strong>CNPJ:</strong> {cnpj}</p>}
          {address && <p><strong>Endereço:</strong> {address}</p>}
          {contactEmail && (
            <p>
              <strong>Contato:</strong>{" "}
              <a href={`mailto:${contactEmail}`} className="hover:underline text-primary">
                {contactEmail}
              </a>
            </p>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          {copyright && <p>{copyright}</p>}
          <p>
            {termsUrl && <a href={termsUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">Termos de Uso</a>}
            {termsUrl && privacyUrl && " \u00B7 "}
            {privacyUrl && <a href={privacyUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>}
          </p>
        </div>
      </div>
    </footer>
  );
}
