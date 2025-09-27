
"use client";

import { useState, useEffect } from "react";
import { useForm, useForm as useFooterForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getFooterData, saveFooterData, FooterData } from "@/services/footer-service";
import { getCheckoutSettings, saveCheckoutSettings, CheckoutSettings } from "@/services/checkout-settings-service";
import { getSiteSettings, saveSiteSettings, SiteSettings } from "@/services/site-settings-service";
import { Textarea } from "@/components/ui/textarea";

// Helper function to convert hex to HSL string
function hexToHsl(hex: string): string | null {
  if (!hex || !hex.startsWith('#')) return null;

  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else {
      return null;
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360); s = Math.round(s * 100); l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}

// Helper to determine contrast color
function getContrastColor(hex: string): string {
  if (!hex.startsWith('#')) return '#FFFFFF';
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#FFFFFF';
  const r = parseInt(result[1], 16), g = parseInt(result[2], 16), b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

const PRIMARY_COLOR_STORAGE_KEY = "theme_primary_color_hex";

const siteSettingsSchema = z.object({
    siteName: z.string().min(1, "O nome do site é obrigatório."),
    faviconUrl: z.string().url("URL do favicon inválida.").or(z.literal('')),
    sidebarLogoUrl: z.string().url("URL do logo inválida.").or(z.literal('')),
})

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;


export default function PersonalizacaoPage() {
  const [primaryColor, setPrimaryColor] = useState("#6d28d9");
  
  const { toast } = useToast();

  const footerForm = useFooterForm<FooterData>({
      defaultValues: getFooterData()
  });

  const checkoutSettingsForm = useForm<CheckoutSettings>({
      defaultValues: getCheckoutSettings()
  });

  const siteSettingsForm = useForm<SiteSettingsFormData>({
      resolver: zodResolver(siteSettingsSchema),
      defaultValues: getSiteSettings()
  })

  useEffect(() => {
    // Load theme color
    const savedColor = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
    if (savedColor) setPrimaryColor(savedColor);
    
    // Load checkout alert settings
    checkoutSettingsForm.reset(getCheckoutSettings());

    // Load footer data
    footerForm.reset(getFooterData());

    // Load site settings
    siteSettingsForm.reset(getSiteSettings());

  }, [footerForm, checkoutSettingsForm, siteSettingsForm]);

  const previewStyle: React.CSSProperties = {
    backgroundColor: primaryColor,
    color: getContrastColor(primaryColor),
  };

  const handleApplyTheme = () => {
    const hslColor = hexToHsl(primaryColor);
    if (!hslColor) {
      toast({ variant: "destructive", title: "Cor Inválida", description: "Por favor, insira um código hexadecimal válido (ex: #RRGGBB)." });
      return;
    }
    localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, primaryColor);
    document.documentElement.style.setProperty('--primary', hslColor);
    toast({ title: "Cor Primária Atualizada!", description: "A nova cor foi aplicada em todo o site." });
    window.dispatchEvent(new Event('themeChanged'));
  };

  const handleSaveCheckoutSettings = (data: CheckoutSettings) => {
    saveCheckoutSettings(data);
    toast({ title: "Configurações do Checkout Salvas!", description: "Suas alterações foram aplicadas." });
  };
  
  const handleSaveFooter = (data: FooterData) => {
    saveFooterData(data);
    window.dispatchEvent(new Event('footerChanged'));
    toast({ title: "Rodapé Atualizado!", description: "As informações do rodapé foram salvas." });
  };
  
  const handleSaveSiteSettings = (data: SiteSettingsFormData) => {
      saveSiteSettings(data);
      toast({ title: "Identidade Visual Salva!", description: "As configurações do site foram atualizadas."})
  }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Identidade Visual do Site</CardTitle>
          <CardDescription>
            Personalize o título, favicon e logo do seu site.
          </CardDescription>
        </CardHeader>
        <form onSubmit={siteSettingsForm.handleSubmit(handleSaveSiteSettings)}>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="siteName">Título do Site (Aba do Navegador)</Label>
                    <Input id="siteName" {...siteSettingsForm.register("siteName")} />
                 </div>
                 <div>
                    <Label htmlFor="faviconUrl">URL do Favicon</Label>
                    <Input id="faviconUrl" placeholder="https://..." {...siteSettingsForm.register("faviconUrl")} />
                 </div>
                 <div>
                    <Label htmlFor="sidebarLogoUrl">URL do Logo da Sidebar</Label>
                    <Input id="sidebarLogoUrl" placeholder="https://..." {...siteSettingsForm.register("sidebarLogoUrl")} />
                 </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 mt-6">
                <Button type="submit">Salvar Identidade Visual</Button>
            </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personalize a Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cor Primária (Hexadecimal)</h3>
            <div className="max-w-xs">
              <Label htmlFor="hex-color">Código da Cor</Label>
              <Input id="hex-color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#6d28d9" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pré-visualização</h3>
            <div className="rounded-lg border p-6">
              <div className="flex flex-col items-center gap-4">
                <Button style={previewStyle}>Botão de Exemplo</Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleApplyTheme}>Aplicar Cor</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Configurações do Checkout</CardTitle>
            <CardDescription>Ajuste as mensagens e alertas exibidos na página de pagamento.</CardDescription>
        </CardHeader>
        <form onSubmit={checkoutSettingsForm.handleSubmit(handleSaveCheckoutSettings)}>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="alert-switch" className="font-medium">Exibir alerta de inadimplência</Label>
                        <p className="text-sm text-muted-foreground">Mostra um aviso na tela do QR Code.</p>
                    </div>
                    <Controller
                        control={checkoutSettingsForm.control}
                        name="showAlert"
                        render={({ field }) => (
                            <Switch
                                id="alert-switch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alert-message">Mensagem de alerta Pix</Label>
                     <Controller
                        control={checkoutSettingsForm.control}
                        name="alertMessage"
                        render={({ field }) => (
                           <Textarea
                                id="alert-message"
                                placeholder="Digite a mensagem de alerta..."
                                disabled={!checkoutSettingsForm.watch("showAlert")}
                                {...field}
                            />
                        )}
                    />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Salvar Configurações do Checkout</Button>
            </CardFooter>
        </form>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle>Personalizar Rodapé</CardTitle>
            <CardDescription>Edite as informações exibidas no rodapé da página de checkout.</CardDescription>
        </CardHeader>
        <form onSubmit={footerForm.handleSubmit(handleSaveFooter)}>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="securePurchaseTitle">Título 1 (Segurança)</Label>
                        <Input id="securePurchaseTitle" {...footerForm.register("securePurchaseTitle")} />
                    </div>
                    <div>
                        <Label htmlFor="protectedDataTitle">Título 2 (Proteção)</Label>
                        <Input id="protectedDataTitle" {...footerForm.register("protectedDataTitle")} />
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" {...footerForm.register("companyName")} />
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" {...footerForm.register("cnpj")} />
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">E-mail de Contato</Label>
                        <Input id="contactEmail" type="email" {...footerForm.register("contactEmail")} />
                    </div>
                 </div>
                 <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" {...footerForm.register("address")} />
                 </div>
                 <div>
                    <Label htmlFor="copyright">Texto de Copyright</Label>
                    <Input id="copyright" {...footerForm.register("copyright")} />
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="termsUrl">URL dos Termos de Uso</Label>
                        <Input id="termsUrl" type="url" {...footerForm.register("termsUrl")} />
                    </div>
                    <div>
                        <Label htmlFor="privacyUrl">URL da Política de Privacidade</Label>
                        <Input id="privacyUrl" type="url" {...footerForm.register("privacyUrl")} />
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Salvar Rodapé</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
