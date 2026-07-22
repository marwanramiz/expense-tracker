# Use lightweight Java image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Run the JAR
ENTRYPOINT ["java","-jar","app.jar"]
