package com.example.notification.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:jdbc:postgresql://localhost:5432/notifications}")
    private String databaseUrl;

    @Value("${DB_USER:postgres}")
    private String dbUser;

    @Value("${DB_PASSWORD:postgres}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = databaseUrl;

        // Convert postgres:// or postgresql:// to jdbc:postgresql://
        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url);
                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();
                
                // If port is not specified, use default PostgreSQL port 5432
                url = String.format("jdbc:postgresql://%s:%d%s", 
                        host, 
                        (port == -1 ? 5432 : port), 
                        path);
                
                // Append original query parameters if present
                if (query != null && !query.isEmpty()) {
                    url += "?" + query;
                }
                
                // Add SSL mode for cloud databases if not already specified
                if (!host.equals("localhost") && !host.equals("127.0.0.1") && !url.contains("sslmode=")) {
                    url += (url.contains("?") ? "&" : "?") + "sslmode=require";
                }
                
                logger.info("Successfully converted DATABASE_URL from postgres:// to JDBC format.");
            } catch (URISyntaxException e) {
                logger.warn("DATABASE_URL is not a valid URI, using as is. Error: {}", e.getMessage());
            }
        }

        // Ensure the URL starts with jdbc:
        if (!url.startsWith("jdbc:")) {
            url = "jdbc:postgresql://" + url;
        }

        logger.info("Configuring DataSource with URL: {}", url);
        logger.info("Using username: {}", dbUser);

        return DataSourceBuilder.create()
                .url(url)
                .username(dbUser)
                .password(dbPassword)
                .build();
    }
}
