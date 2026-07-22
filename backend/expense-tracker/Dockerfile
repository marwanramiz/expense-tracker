# Use official Java 17 image
FROM eclipse-temurin:17-jdk

# Set working directory inside container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Run the JAR
ENTRYPOINT ["java","-jar","app.jar"]
