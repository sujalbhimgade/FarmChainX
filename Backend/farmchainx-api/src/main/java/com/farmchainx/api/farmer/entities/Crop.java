package com.farmchainx.api.farmer.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.farmchainx.api.auth.entities.User;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "crops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crop {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "farmer_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
  private User farmer;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(length = 100)
  private String type;
  
  @Column(length = 100)
  private String soil_type;

  @Column(length = 160)
  private String fieldLocation;
  
  private Double area;
  
  private String area_unit;
  
  private Double gpsCoordinates;
  
  @Lob
  @Column(columnDefinition = "MEDIUMTEXT") 
  private String image_url;
  
  private String pesticides;

  private LocalDate plantedDate;

  private LocalDate harvestDate;

  @Column(length = 20)
  private String status;

  private Double quantityKg;

  private Double unitPrice;

  @Column(length = 300)
  private String qualityGrade;

  @Column(length = 500)
  private String notes;

  @Column(length = 64, unique = true)
  private String batchCode;
  
  private Instant created_at;

  private Instant updated_at;
  
@Column(unique = true, length = 40)
private String publicId; // e.g., UUID or short id

@Builder.Default
@Column(nullable = false)
private boolean publicVisible = false;

private Instant publishedAt;

}
