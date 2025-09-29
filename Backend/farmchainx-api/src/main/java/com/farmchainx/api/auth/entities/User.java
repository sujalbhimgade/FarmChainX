package com.farmchainx.api.auth.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @Column(nullable = false, unique = true, length = 120)
  private String email;

  @Column(name = "password_hash", nullable = false, length = 100)
  private String password;

  @Column(length = 20)
  private String mobile;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  @Builder.Default
  private Set<Role> roles = new HashSet<>();
}
