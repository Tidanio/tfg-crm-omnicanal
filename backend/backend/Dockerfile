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
# Limitamos memoria (-Xmx350m) y forzamos IPv4 (-Djava.net.preferIPv4Stack=true) para evitar errores de red en Supabase
ENTRYPOINT ["java", "-Xmx350m", "-Djava.net.preferIPv4Stack=true", "-Dsun.net.spi.nameservice.provider.1=dns,sun", "-jar", "app.jar"]