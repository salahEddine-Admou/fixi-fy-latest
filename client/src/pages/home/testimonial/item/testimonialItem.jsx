// item/TestimonialItem.jsx
import React, { useState, useEffect } from 'react';
import { Rate } from 'antd';

const TestimonialItem = ({ id, title, description, fullname, job, initialRating, avatar }) => {
    // Utiliser un ID unique pour chaque témoignage pour identifier correctement la note stockée
    const localStorageKey = `testimonial-rating-${id}`;

    // Récupérer la note depuis LocalStorage ou utiliser initialRating par défaut
    const storedRating = localStorage.getItem(localStorageKey);
    const [rating, setRating] = useState(storedRating ? parseInt(storedRating, 10) : initialRating || 0);

    useEffect(() => {
        // Mettre à jour le rating à partir de localStorage lorsque le composant est monté
        if (storedRating) {
            setRating(parseInt(storedRating, 10));
        }
    }, [storedRating]);

    const handleRatingChange = (value) => {
        setRating(value);
        // Sauvegarder la note dans LocalStorage
        localStorage.setItem(localStorageKey, value);
        // Vous pouvez ajouter une logique supplémentaire ici pour gérer la soumission de la notation, par exemple, l'envoi au serveur.
    };

    return (

        <div class="flex flex-col rounded-xl border border-blue-600 text-center shadow-md shadow-blue-200">
            <div class="relative flex flex-1 flex-col justify-between p-6 lg:py-7 lg:px-5">
                <span class="absolute -left-5 -top-6 rounded-full border border-blue-600 bg-white p-3 text-5xl">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M7.16 3.5C4.73 5.06 3.55 6.67 3.55 9.36c.16-.05.3-.05.44-.05c1.27 0 2.5.86 2.5 2.41c0 1.61-1.03 2.61-2.5 2.61c-1.9 0-2.99-1.52-2.99-4.25c0-3.8 1.75-6.53 5.02-8.42L7.16 3.5zm7 0c-2.43 1.56-3.61 3.17-3.61 5.86c.16-.05.3-.05.44-.05c1.27 0 2.5.86 2.5 2.41c0 1.61-1.03 2.61-2.5 2.61c-1.89 0-2.98-1.52-2.98-4.25c0-3.8 1.75-6.53 5.02-8.42l1.14 1.84h-.01z" clip-rule="evenodd" /></svg>
                </span>
                <div class="flex-1">
                    <p class="border-blue-500 px-10 text-xl font-black">{title}</p>
                    <blockquote class="mt-8 flex-1">
                        <p class="leading-relaxed text-blue-900">{description}</p>
                    </blockquote>
                </div>
                <div class="-mx-5 mt-8 px-8 py-1">
                    <div class="">
                        <p class="text-base font-bold">{fullname}</p>
                        <p class="text-blue-90 mt-0.5 text-sm">{job}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialItem;
