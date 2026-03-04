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
ENV PORT=8080
EXPOSE $PORT
# FIX IMPORTANTE: Usamos "sh -c" para que la variable ${PORT} se lea correctamente.
# Antes fallaba porque en modo ["java", ...] no se leen variables de entorno.
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Djava.net.preferIPv4Stack=true -Dserver.port=${PORT} -jar app.jar"]
