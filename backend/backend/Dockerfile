# Etapa de compilación
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Railway asigna un puerto dinámico en la variable $PORT. Debemos usarlo.
ENV PORT=8080
EXPOSE $PORT
# Usamos -Dserver.port=$PORT para que Spring Boot escuche en el puerto correcto de Railway
ENTRYPOINT ["java", "-Xmx350m", "-Djava.net.preferIPv4Stack=true", "-Dserver.port=${PORT}", "-jar", "app.jar"]
