
"use client";

export interface Review {
    id: string;
    name: string;
    text: string;
    rating: number; // 1-5
    avatarUrl?: string;
}

const REVIEWS_STORAGE_KEY = "firebase-studio-reviews";

/**
 * Retrieves the list of reviews from localStorage.
 * @returns {Review[]} An array of review objects.
 */
export function getReviews(): Review[] {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const reviewsJson = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
        // Initialize with default reviews if none are stored
        if (!reviewsJson) {
            const defaultReviews: Review[] = [
                { id: '1', name: 'Maria S.', text: '“Transformou meu negócio! Os criativos que aprendi a fazer aqui geraram um ROI de 5x em menos de 30 dias. Essencial para quem quer escalar.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
                { id: '2', name: 'João P.', text: '“Didática incrível e conteúdo direto ao ponto. Consegui aplicar as técnicas no mesmo dia e já vi um aumento significativo no engajamento.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
                { id: '3', name: 'Ana L.', text: '“O melhor investimento que fiz para minha loja. As estratégias de criativos são ouro puro e o suporte do Mago é fora de série.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
            ];
            window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews));
            return defaultReviews;
        }
        return JSON.parse(reviewsJson);
    } catch (error) {
        console.error("Failed to retrieve reviews from localStorage", error);
        return [];
    }
}

/**
 * Saves a new review to the list in localStorage.
 * @param {Omit<Review, 'id'>} reviewData The new review data.
 * @returns {Review} The full review object with id.
 */
export function saveReview(reviewData: Omit<Review, 'id'>): Review {
    if (typeof window === "undefined") {
        throw new Error("Cannot save review on the server.");
    }
    try {
        const existingReviews = getReviews();
        const newReview: Review = {
            id: new Date().getTime().toString(),
            ...reviewData,
        };
        const updatedReviews = [newReview, ...existingReviews];
        window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updatedReviews));
        return newReview;
    } catch (error) {
        console.error("Failed to save review to localStorage", error);
        throw error;
    }
}

/**
 * Updates an existing review in localStorage.
 * @param {Review} updatedReview The review object with updated data.
 * @returns {Review} The updated review object.
 */
export function updateReview(updatedReview: Review): Review {
    if (typeof window === "undefined") {
        throw new Error("Cannot update review on the server.");
    }
    try {
        const existingReviews = getReviews();
        const reviewIndex = existingReviews.findIndex(r => r.id === updatedReview.id);

        if (reviewIndex === -1) {
            throw new Error("Review not found.");
        }

        existingReviews[reviewIndex] = updatedReview;
        window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(existingReviews));
        return updatedReview;
    } catch (error) {
        console.error("Failed to update review in localStorage", error);
        throw error;
    }
}

/**
 * Deletes a review from localStorage by its ID.
 * @param {string} reviewId The ID of the review to delete.
 */
export function deleteReview(reviewId: string): void {
    if (typeof window === "undefined") {
        throw new Error("Cannot delete review on the server.");
    }
    try {
        const existingReviews = getReviews();
        const updatedReviews = existingReviews.filter(r => r.id !== reviewId);
        window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updatedReviews));
    } catch (error) {
        console.error("Failed to delete review from localStorage", error);
        throw error;
    }
}

    