package com.farmchainx.api.shipping.entities;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.trace.entities.SupplyStage;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "shipments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Shipment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 32, unique = true, nullable = false)
  private String shipmentId;

  @Column(length = 64, nullable = false)
  private String batchCode;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "crop_id", nullable = false)
  private Crop crop;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "from_user_id", nullable = false)
  private User fromUser;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "to_user_id", nullable = false)
  private User toUser;

  @Enumerated(EnumType.STRING) @Column(length = 24, nullable = false)
  private SupplyStage fromStage;

  @Enumerated(EnumType.STRING) @Column(length = 24, nullable = false)
  private SupplyStage toStage;

  @Column(length = 160)
  private String originLocation;

  @Column(length = 160)
  private String destinationLocation;

  private Double quantityKg;

  private Double unitPrice;

  private Double totalValue;

  @Column(length = 40)
  private String vehicle;

  private Double temperatureC;

  private Double humidity;

  @Enumerated(EnumType.STRING) @Column(length = 24, nullable = false)
  private ShipmentStatus status;

  private Instant createdAt;

  private Instant updatedAt;

  private LocalDate expectedDelivery;
}
