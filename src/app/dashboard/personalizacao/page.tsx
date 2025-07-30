
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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


export default function PersonalizacaoPage() {
  const [primaryColor, setPrimaryColor] = useState("#6d28d9");

  const previewStyle: React.CSSProperties = {
    backgroundColor: primaryColor,
    color: getContrastColor(primaryColor),
  };

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
              Insira o código hexadecimal para a cor primária do seu checkout.
              <br />
              Quando decidir, me diga qual valor você quer usar e eu aplicarei a mudança em todo o site.
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
      </Card>
    </div>
  );
}
