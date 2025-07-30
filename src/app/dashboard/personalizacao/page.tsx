
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Helper function to convert hex to HSL string
function hexToHsl(hex: string): string | null {
  if (!hex || !hex.startsWith('#')) return null;

  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  // 6 digits
  } else if (hex.length == 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else {
      return null;
  }

  r /= 255;
  g /= 255;
  b /= 255;
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

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}


// Helper to determine if the text on the button should be black or white
function getContrastColor(hex: string): string {
  if (!hex.startsWith('#')) return '#FFFFFF';

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#FFFFFF';

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // Simple luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

const PRIMARY_COLOR_STORAGE_KEY = "theme_primary_color_hex";

export default function PersonalizacaoPage() {
  const [primaryColor, setPrimaryColor] = useState("#6d28d9");
  const { toast } = useToast();

  useEffect(() => {
    const savedColor = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  const previewStyle: React.CSSProperties = {
    backgroundColor: primaryColor,
    color: getContrastColor(primaryColor),
  };

  const handleApply = () => {
    const hslColor = hexToHsl(primaryColor);
    
    if (!hslColor) {
        toast({
            variant: "destructive",
            title: "Cor Inválida",
            description: "Por favor, insira um código hexadecimal válido (ex: #RRGGBB).",
        });
        return;
    }

    localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, primaryColor);
    document.documentElement.style.setProperty('--primary', hslColor);

    toast({
        title: "Cor Primária Atualizada!",
        description: "A nova cor foi aplicada em todo o site.",
    });

    // We can trigger a custom event to notify the layout to re-render if needed
    window.dispatchEvent(new Event('themeChanged'));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalize a Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cor Primária (Hexadecimal)</h3>
            <p className="text-sm text-muted-foreground">
              Use o campo abaixo para testar e salvar sua nova cor primária.
            </p>
            <div className="max-w-xs">
              <Label htmlFor="hex-color">Código da Cor</Label>
              <Input
                id="hex-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#6d28d9"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pré-visualização</h3>
            <div className="rounded-lg border p-6">
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">Este é um botão de exemplo:</p>
                <Button style={previewStyle}>
                  Botão de Exemplo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleApply}>Aplicar e Salvar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
