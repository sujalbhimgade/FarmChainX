package com.farmchainx.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider(UserDetailsService uds, BCryptPasswordEncoder enc) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds); // non-deprecated constructor
    provider.setPasswordEncoder(enc);
    return provider;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http,
                                         JwtAuthFilter jwtFilter,
                                         AuthenticationProvider authenticationProvider) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // public endpoints for testing
        .requestMatchers(HttpMethod.GET, "/api/ping").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/signin", "/api/auth/refresh").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .requestMatchers("/api/farmer/**").hasAnyRole("FARMER","ADMIN")
        .requestMatchers("/api/distributor/**").hasAnyRole("DISTRIBUTOR","ADMIN")
        .requestMatchers("/api/retailer/**").hasAnyRole("RETAILER","ADMIN")
        .requestMatchers("/api/consumer/**").hasAnyRole("CONSUMER","ADMIN")
        .anyRequest().authenticated()
      )
      .authenticationProvider(authenticationProvider)
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
      .cors(cors -> cors.configurationSource(corsConfigurationSource(null))); // will be overridden by bean below
    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource(
      @Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOrigins) {
    var cfg = new CorsConfiguration();
    // Support comma-separated list in property
    cfg.setAllowedOrigins(List.of(allowedOrigins.split("\\s*,\\s*")));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("Authorization","Content-Type"));
    cfg.setExposedHeaders(List.of("Authorization"));
    cfg.setAllowCredentials(true);
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}
