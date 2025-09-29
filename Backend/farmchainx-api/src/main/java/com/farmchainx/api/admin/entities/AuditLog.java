// com/farmchainx/api/admin/entities/AuditLog.java
package com.farmchainx.api.admin.entities;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity @Table(name = "admin_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false) private Long userId;
  @Column(nullable = false, length = 64) private String action;
  @Column(nullable = false, length = 64) private String entityType;
  @Column(nullable = false, length = 64) private String entityId;
  @Column(nullable = false) private Instant at;
  @Lob private String beforeJson;
  @Lob private String afterJson;
}
