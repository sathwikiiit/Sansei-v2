# Example using OpenJDK
FROM openjdk:22-jdk-slim AS builder

# Example using Eclipse Temurin
# FROM eclipse-temurin:22-jdk-jammy AS builder

# Example using Azul Zulu
# FROM azul/zulu-openjdk:22 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy your Spring Boot application JAR file (assuming you've built it)
COPY target/*.jar app.jar

# Define the command to run your application
CMD ["java", "-jar", "app.jar"]