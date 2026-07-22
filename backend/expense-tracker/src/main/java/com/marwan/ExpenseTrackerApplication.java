package com.marwan;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ExpenseTrackerApplication implements CommandLineRunner {

	@Value("${spring.data.mongodb.uri}")
	private String mongoUri;

	public static void main(String[] args) {
		SpringApplication.run(ExpenseTrackerApplication.class, args);
	}

	@Override
	public void run(String... args) {
		System.out.println(">>> Loaded MongoDB URI: " + mongoUri);
	}

	// Explicitly create MongoClient bean so Spring Boot uses Atlas URI
	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create(mongoUri);
	}
}