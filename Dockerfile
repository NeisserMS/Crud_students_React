# Utilizar una imagen base de Node.js para construir la aplicación
FROM node:18 AS build

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Utilizar una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exponer el puerto que Nginx usará
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]