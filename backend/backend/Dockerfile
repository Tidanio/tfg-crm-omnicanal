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
EXPOSE 8080
# Limitamos la memoria a 350MB para evitar que Railway (plan gratuito/starter) mate el proceso por OOM
ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]
