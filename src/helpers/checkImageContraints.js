/**
  * Función para verificar si un archivo de imagen tiene aspecto 1:1
  * Retorna una Promise que resuelve en "true" si es cuadrada, "false" si no.
  */
function checkImageConstraints(
    file,
    minWidth = 300,
    minHeight = 300,
    maxWidth = 10000,
    maxHeight = 10000
) {
    return new Promise((resolve) => {
        const imgUrl = URL.createObjectURL(file);
        const tempImg = new Image();
        tempImg.src = imgUrl;

        tempImg.onload = () => {
            const w = tempImg.width;
            const h = tempImg.height;

            // 1. Verificar si es cuadrado
            if (w !== h) {
                console.warn(`Imagen no es cuadrada. Dimensiones: ${w}x${h}`);
                resolve(false);
                return;
            }

            // 2. Verificar resolución mínima
            if (w < minWidth || h < minHeight) {
                console.warn(
                    `Imagen demasiado pequeña. Mínimo: ${minWidth}x${minHeight}, obtenido: ${w}x${h}`
                );
                resolve(false);
                return;
            }

            // 3. Verificar resolución máxima
            if (w > maxWidth || h > maxHeight) {
                console.warn(
                    `Imagen excede las dimensiones máximas. Máximo: ${maxWidth}x${maxHeight}, obtenido: ${w}x${h}`
                );
                resolve(false);
                return;
            }

            // Si llega hasta aquí, cumple todos los criterios
            resolve(true);
        };

        tempImg.onerror = () => {
            console.error("Error al cargar la imagen (posible archivo corrupto).");
            resolve(false);
        };
    });
}

export default checkImageConstraints;