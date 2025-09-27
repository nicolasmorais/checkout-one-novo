
"use client";

export interface Review {
    id: string;
    name: string;
    text: string;
    rating: number; // 1-5
    avatarUrl?: string;
}

const REVIEWS_STORAGE_KEY = "firebase-studio-reviews"; // This can be deprecated or used as a fallback

/**
 * Retrieves a default list of reviews. This function can be used
 * when a product doesn't have specific reviews yet.
 * @returns {Review[]} An array of review objects.
 */
export function getDefaultReviews(): Review[] {
    return [
        { id: '1', name: 'Maria S.', text: '“Transformou meu negócio! Os criativos que aprendi a fazer aqui geraram um ROI de 5x em menos de 30 dias. Essencial para quem quer escalar.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: '2', name: 'João P.', text: '“Didática incrível e conteúdo direto ao ponto. Consegui aplicar as técnicas no mesmo dia e já vi um aumento significativo no engajamento.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
        { id: '3', name: 'Ana L.', text: '“O melhor investimento que fiz para minha loja. As estratégias de criativos são ouro puro e o suporte do Mago é fora de série.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
    ];
}
