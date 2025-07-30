
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalizacaoPage() {
  const [hue, setHue] = useState("262.1");
  const [saturation, setSaturation] = useState("83.3");
  const [lightness, setLightness] = useState("57.8");

  const previewHsl = useMemo(() => {
    const h = parseFloat(hue) || 0;
    const s = parseFloat(saturation) || 0;
    const l = parseFloat(lightness) || 0;
    return `${h} ${s}% ${l}%`;
  }, [hue, saturation, lightness]);
  
  const previewStyle: React.CSSProperties = {
    "--primary-preview": previewHsl,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalize a Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cor Primária (HSL)</h3>
            <p className="text-sm text-muted-foreground">
              Insira os valores HSL para a cor primária do seu checkout.
              <br />
              Quando decidir, me diga quais valores você quer usar e eu aplicarei a mudança em todo o site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hue">Matiz (Hue)</Label>
                <Input
                  id="hue"
                  value={hue}
                  onChange={(e) => setHue(e.target.value)}
                  placeholder="Ex: 262.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saturation">Saturação (Saturation)</Label>
                <Input
                  id="saturation"
                  value={saturation}
                  onChange={(e) => setSaturation(e.target.value)}
                  placeholder="Ex: 83.3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightness">Luminosidade (Lightness)</Label>
                <Input
                  id="lightness"
                  value={lightness}
                  onChange={(e) => setLightness(e.target.value)}
                  placeholder="Ex: 57.8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pré-visualização</h3>
            <div className="rounded-lg border p-6" style={previewStyle}>
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">Este é um botão de exemplo:</p>
                <Button
                  style={{
                    backgroundColor: `hsl(${previewHsl})`,
                    color: parseFloat(lightness) > 50 ? '#000' : '#FFF' // Simple contrast check
                  }}
                >
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
