package com.farmchainx.api.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.time.*;
import java.util.*;

@Service
public class JwtService {
	@Value("${app.jwt.secret:dev-secret-32-characters-minimum-please-change}")
	private String secret;

	@Value("${app.jwt.issuer:farmchainx}")
	private String issuer;

	@Value("${app.jwt.access-exp-min:60}")
	private long accessExpMin;

	@Value("${app.jwt.refresh-exp-days:7}")
	private long refreshExpDays;


  private Key key;

  @PostConstruct
  void init() {
    if (secret == null || secret.length() < 32) {
      String base = (secret == null ? "" : secret);
      // pad to 32 chars for HS256 local use; replace via config in prod
      secret = (base + "________________________________").substring(0, 32);
    }
    key = Keys.hmacShaKeyFor(secret.getBytes());
  }

  public String generateAccessToken(String subject, Collection<String> roles) {
    var now = Instant.now();
    return Jwts.builder()
      .setSubject(subject)
      .setIssuer(issuer)
      .claim("roles", roles)
      .setIssuedAt(Date.from(now))
      .setExpiration(Date.from(now.plusSeconds(accessExpMin * 60)))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  public String generateRefreshToken(String subject) {
    var now = Instant.now();
    return Jwts.builder()
      .setSubject(subject)
      .setIssuer(issuer)
      .setIssuedAt(Date.from(now))
      .setExpiration(Date.from(now.plus(Duration.ofDays(refreshExpDays))))
      .signWith(key, SignatureAlgorithm.HS256)
      .compact();
  }

  public boolean isValid(String token) {
    try { parseAllClaims(token); return true; }
    catch (JwtException | IllegalArgumentException e) { return false; }
  }

  public String getSubject(String token) {
    return parseAllClaims(token).getBody().getSubject();
  }

	/* @SuppressWarnings("unchecked") */
  public List<String> getRoles(String token) {
    var body = parseAllClaims(token).getBody();
    Object roles = body.get("roles");
    if (roles instanceof List<?> list) return list.stream().map(Object::toString).toList();
    return List.of();
  }

  private Jws<Claims> parseAllClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }
}
