
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
  { name: "Padrão", hsl: "262.1 83.3% 57.8%", className: "bg-purple-600" },
  { name: "Azul", hsl: "221.2 83.2% 53.3%", className: "bg-blue-600" },
  { name: "Verde", hsl: "142.1 76.2% 36.3%", className: "bg-green-600" },
  { name: "Laranja", hsl: "24.6 95% 53.1%", className: "bg-orange-600" },
  { name: "Vermelho", hsl: "0 84.2% 60.2%", className: "bg-red-600" },
  { name: "Rosa", hsl: "332.2 81.9% 55.1%", className: "bg-pink-600" },
];

export default function PersonalizacaoPage() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({
    "--primary-preview": colors[0].hsl,
  } as React.CSSProperties);

  const handleColorSelect = (color: typeof colors[0]) => {
    setSelectedColor(color);
    setPreviewStyle({ "--primary-preview": color.hsl } as React.CSSProperties);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalize a Aparência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cor Primária</h3>
            <p className="text-sm text-muted-foreground">
              Escolha uma cor primária para o seu checkout. Clique em uma cor para pré-visualizar.
              <br />
              Quando decidir, me diga qual cor você quer usar e eu aplicarei a mudança em todo o site.
            </p>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-md border-2 transition-all",
                    color.className,
                    selectedColor.name === color.name
                      ? "border-foreground ring-4 ring-ring ring-offset-2"
                      : "border-transparent"
                  )}
                  aria-label={`Selecionar cor ${color.name}`}
                >
                  {selectedColor.name === color.name && (
                    <Check className="h-8 w-8 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pré-visualização</h3>
            <div className="rounded-lg border p-6" style={previewStyle}>
              <div className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground">Este é um botão de exemplo:</p>
                <Button
                  style={{
                    backgroundColor: `hsl(${previewStyle['--primary-preview']})`,
                  }}
                  className="text-primary-foreground"
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
