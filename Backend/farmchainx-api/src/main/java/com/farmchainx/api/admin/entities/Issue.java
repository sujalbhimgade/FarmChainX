// com/farmchainx/api/admin/entities/Issue.java
package com.farmchainx.api.admin.entities;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity @Table(name = "admin_issues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Issue {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120) private String title;
  @Column(nullable = false, length = 48)  private String type;
  @Column(nullable = false, length = 16)  private String severity;
  @Column(nullable = false, length = 24)  private String status;
  @Column(length = 2000)                  private String description;
  @Column(length = 120)                   private String reportedBy;
  @Column(nullable = false)               private Instant createdAt;
}
