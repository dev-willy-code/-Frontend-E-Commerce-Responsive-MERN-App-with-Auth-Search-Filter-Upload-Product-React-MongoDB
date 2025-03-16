//Base64 es útil para previsualización y almacenar temporalmente imágenes en el cliente, pero no reemplaza un almacenamiento permanente como un servidor o un servicio en la nube (AWS S3).

//se usa una promesa en la función imageTobase64 es porque el proceso de lectura de un archivo con FileReader es asíncrono. Esto significa que la operación de lectura no se completa inmediatamente; se ejecuta en segundo plano mientras el código sigue ejecutándose.
const imageTobase64 = async (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image)

    const data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)

        reader.onerror = error => reject(error)
    });
    return data;
}

export default imageTobase64;
//Usamos una promesa para esperar el resultado de esa operación asíncrona. Aquí es donde entra la promesa: te permite manejar el resultado de la operación cuando esta termine.

//fetch es una API que se utiliza para realizar peticiones de red(solicitudes HTTP o HTTPS) y obtener recursos de un servidor remoto