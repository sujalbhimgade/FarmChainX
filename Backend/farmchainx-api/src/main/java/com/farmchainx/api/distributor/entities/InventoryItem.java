package com.farmchainx.api.distributor.entities;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.farmer.entities.Crop;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "inv_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "distributor_id", nullable = false)
  private User distributor;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id", nullable = false)
  private Crop crop;

  @Column(length = 64, nullable = false)
  private String batchCode;

  @Column(length = 120, nullable = false)
  private String productName;

  private Double quantityKg;

  @Column(length = 80)
  private String location;

  @Column(length = 40)
  private String grade;

  private Double pricePerKg;

  private LocalDate expiryDate;

  private Boolean qualityChecked;

  private Instant receivedAt;

  @Column(length = 300)
  private String notes;

  // available | low-stock | critical | out-of-stock
  @Column(length = 24)
  private String status;
}
