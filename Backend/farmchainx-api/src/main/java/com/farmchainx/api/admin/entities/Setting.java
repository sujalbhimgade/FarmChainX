// com/farmchainx/api/admin/entities/Setting.java
package com.farmchainx.api.admin.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "admin_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Setting {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 120) private String configKey;
  @Column(nullable = false, length = 500)                 private String configValue;
  @Column(nullable = false, length = 48)                  private String category;
  @Column(length = 500)                                   private String description;
}
