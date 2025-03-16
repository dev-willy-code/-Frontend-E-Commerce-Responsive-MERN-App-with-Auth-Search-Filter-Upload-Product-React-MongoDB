const Star = ({ filled = 1 }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            {/* Fondo de estrella vacía */}
            <path
                d="M12 2L14.9 8.6L22 9.3L16.5 14L18 21L12 17.5L6 21L7.5 14L2 9.3L9.1 8.6L12 2Z"
                fill="#6B7280" // Gris oscuro
            />
            {/* Parte rellena de la estrella */}
            <path
                d="M12 2L14.9 8.6L22 9.3L16.5 14L18 21L12 17.5L6 21L7.5 14L2 9.3L9.1 8.6L12 2Z"
                fill="#EAB308" // Amarillo oscuro
                style={{ clipPath: `inset(0 ${(1 - filled) * 100}% 0 0)` }} // Recorta la estrella
            />
        </svg>
    );
};

const StarRatingAverage = ({ rating }) => {
    const fullStars = Math.floor(rating); // Estrellas llenas
    const decimalPart = rating % 1; // Fracción de la estrella
    const hasPartialStar = decimalPart > 0; // Verifica si hay estrella parcial
    const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0); // Estrellas vacías restantes

    return (
        <div className="flex gap-1">
            {/* Estrellas llenas */}
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={i} filled={1} />
            ))}

            {/* Estrella parcial si hay decimales */}
            {hasPartialStar && <Star filled={decimalPart} />}

            {/* Estrellas vacías */}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={i + fullStars} filled={0} />
            ))}
        </div>
    );
};

export default StarRatingAverage;
