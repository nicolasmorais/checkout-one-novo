
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getReviews, saveReview, updateReview, deleteReview, Review } from "@/services/reviews-service";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, PlusCircle, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const reviewSchema = z.object({
  name: z.string().min(2, "O nome é obrigatório."),
  text: z.string().min(10, "A avaliação deve ter pelo menos 10 caracteres."),
  rating: z.coerce.number().min(1).max(5),
  avatarUrl: z.string().url("URL do avatar inválida.").optional().or(z.literal('')),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function PersonalizacaoPage() {
  const [primaryColor, setPrimaryColor] = useState("#6d28d9");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { toast } = useToast();

  const reviewForm = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { name: "", text: "", rating: 5, avatarUrl: "" },
  });

  useEffect(() => {
    const savedColor = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
    if (savedColor) setPrimaryColor(savedColor);
    setReviews(getReviews());
  }, []);

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

  const handleOpenReviewForm = (review: Review | null) => {
    setSelectedReview(review);
    reviewForm.reset(review || { name: "", text: "", rating: 5, avatarUrl: "" });
    setIsReviewFormOpen(true);
  };

  const handleReviewFormSubmit = (data: ReviewFormData) => {
    try {
      if (selectedReview) {
        const updatedReview = updateReview({ ...selectedReview, ...data });
        setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
        toast({ title: "Avaliação Atualizada!", description: "A avaliação foi salva com sucesso." });
      } else {
        const newReview = saveReview(data);
        setReviews([newReview, ...reviews]);
        toast({ title: "Avaliação Adicionada!", description: "A nova avaliação foi adicionada." });
      }
      setIsReviewFormOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Salvar", description: "Não foi possível salvar a avaliação." });
    }
  };

  const handleOpenDeleteAlert = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteReview = () => {
    if (!selectedReview) return;
    try {
      deleteReview(selectedReview.id);
      setReviews(reviews.filter(r => r.id !== selectedReview.id));
      toast({ title: "Avaliação Excluída!", description: "A avaliação foi removida." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Excluir", description: "Não foi possível excluir a avaliação." });
    } finally {
      setIsDeleteAlertOpen(false);
      setSelectedReview(null);
    }
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
          <Button onClick={handleApplyTheme}>Aplicar e Salvar</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Gerenciar Avaliações do Checkout</CardTitle>
                <CardDescription>Adicione, edite ou remova as avaliações que aparecem na página de pagamento.</CardDescription>
            </div>
            <Button onClick={() => handleOpenReviewForm(null)}>
                <PlusCircle className="mr-2"/>
                Adicionar Avaliação
            </Button>
        </CardHeader>
        <CardContent>
           {reviews.length > 0 ? (
               <div className="space-y-4">
                   {reviews.map(review => (
                       <div key={review.id} className="flex items-start gap-4 rounded-lg border p-4">
                           <Avatar>
                               <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${review.name.charAt(0)}`} alt={review.name} data-ai-hint="person avatar"/>
                               <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{review.name}</p>
                                    <div className="flex items-center">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                                        {[...Array(5 - review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-gray-300" />)}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                           </div>
                           <div className="flex gap-2">
                               <Button variant="outline" size="icon" onClick={() => handleOpenReviewForm(review)}><Edit className="h-4 w-4"/></Button>
                               <Button variant="destructive" size="icon" onClick={() => handleOpenDeleteAlert(review)}><Trash2 className="h-4 w-4"/></Button>
                           </div>
                       </div>
                   ))}
               </div>
           ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Nenhuma avaliação cadastrada ainda.</p>
                </div>
           )}
        </CardContent>
      </Card>
      
      {/* Review Add/Edit Dialog */}
      <AlertDialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
        <AlertDialogContent>
          <form onSubmit={reviewForm.handleSubmit(handleReviewFormSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedReview ? 'Editar Avaliação' : 'Adicionar Nova Avaliação'}</AlertDialogTitle>
              <div className="space-y-4 pt-4">
                 <Input {...reviewForm.register("name")} placeholder="Nome do Cliente" />
                 {reviewForm.formState.errors.name && <p className="text-destructive text-sm">{reviewForm.formState.errors.name.message}</p>}
                 <Textarea {...reviewForm.register("text")} placeholder="Texto da avaliação..."/>
                 {reviewForm.formState.errors.text && <p className="text-destructive text-sm">{reviewForm.formState.errors.text.message}</p>}
                 <Input {...reviewForm.register("avatarUrl")} placeholder="URL da Foto (opcional, ex: https://...)"/>
                 {reviewForm.formState.errors.avatarUrl && <p className="text-destructive text-sm">{reviewForm.formState.errors.avatarUrl.message}</p>}
                 <div>
                    <Label>Nota (1 a 5 estrelas)</Label>
                    <Input type="number" {...reviewForm.register("rating")} min="1" max="5"/>
                    {reviewForm.formState.errors.rating && <p className="text-destructive text-sm">{reviewForm.formState.errors.rating.message}</p>}
                 </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel type="button" onClick={() => setIsReviewFormOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit">Salvar</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A avaliação será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview}>Sim, excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    