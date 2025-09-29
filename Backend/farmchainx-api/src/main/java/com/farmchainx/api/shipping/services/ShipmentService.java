package com.farmchainx.api.shipping.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.security.SecurityUtils;
import com.farmchainx.api.shipping.dto.*;
import com.farmchainx.api.shipping.entities.*;
import com.farmchainx.api.shipping.repo.ShipmentRepository;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.farmchainx.api.distributor.services.InventoryService;
import com.farmchainx.api.distributor.dto.InventoryUpsertRequest;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service("shipmentService")
public class ShipmentService {
  private final ShipmentRepository shipments;
  private final CropRepository crops;
  private final UserRepository users;
  private final TraceService trace;
  private final InventoryService inventory;

  public ShipmentService(ShipmentRepository shipments, CropRepository crops, UserRepository users, TraceService trace, InventoryService inventory) {
    this.shipments = shipments;
    this.crops = crops;
    this.users = users;
    this.trace = trace;
    this.inventory = inventory;
  }

  @Transactional(readOnly = true)
  public boolean canUpdate(Long id) {
    var me = SecurityUtils.currentUser(users).orElse(null);
    var s = shipments.findById(id).orElse(null);
    if (me == null || s == null) return false;
    return me.getId().equals(s.getFromUser().getId()) || (s.getToUser() != null && me.getId().equals(s.getToUser().getId()));
  }

  @Transactional
  public ShipmentResponse create(ShipmentCreateRequest req) {
    User farmer = SecurityUtils.currentUser(users).orElseThrow();
    Crop crop = crops.findById(req.cropId()).orElseThrow();
    User distributor = users.findById(req.distributorUserId()).orElseThrow();

    String batch = crop.getBatchCode();
    if (batch == null || batch.isBlank()) {
      batch = "BATCH-" + System.currentTimeMillis() + "-" + new Random().nextInt(1000);
      crop.setBatchCode(batch);
      crops.save(crop);
    }

    String ship = "SH-" + System.currentTimeMillis() + "-" + new Random().nextInt(1000);

    double total = req.quantityKg() * req.unitPrice();
    
  String destination = req.destinationLocation();
 if (destination == null || destination.isBlank()) {
	    destination = (distributor.getFullName() != null)
	        ? distributor.getFullName()
	        : ("Distributor " + distributor.getId());
	  }

    
//After computing `destination`...
Shipment s = Shipment.builder()
  .shipmentId(ship)
  .batchCode(batch)
  .crop(crop)
  .fromUser(farmer)
  .toUser(distributor)
  .fromStage(SupplyStage.FARMER)
  .toStage(SupplyStage.DISTRIBUTOR)
  .originLocation(crop.getFieldLocation())
  .destinationLocation(destination) // use computed fallback here
  .quantityKg(req.quantityKg())
  .unitPrice(req.unitPrice())
  .totalValue(total)
  .vehicle(req.vehicle())
  .status(ShipmentStatus.CREATED)
  .createdAt(Instant.now())
  .updatedAt(Instant.now())
  .expectedDelivery(req.expectedDelivery())
  .build();


    Shipment saved = shipments.save(s);
    trace.add(saved.getBatchCode(), SupplyStage.FARMER, saved.getOriginLocation(), "Shipment created " + saved.getShipmentId (), farmer);
    return toResponse(saved);
  }

  @Transactional(readOnly = true)
  public List<ShipmentResponse> myOutgoing() {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    return shipments.findByFromUser(me).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<ShipmentResponse> myIncoming() {
    User me = SecurityUtils.currentUser(users).orElseThrow();
    return shipments.findByToUser(me).stream().map(this::toResponse).toList();
  }

//inside ShipmentService.updateStatus(...)
@Transactional
public ShipmentResponse updateStatus(Long id, ShipmentUpdateRequest req) {
   User me = SecurityUtils.currentUser(users).orElseThrow();
   Shipment s = shipments.findById(id).orElseThrow();

   if (!canUpdate(id)) {
       throw new IllegalStateException("Not allowed...");
   }

   var oldStatus = s.getStatus(); // capture old status for idempotency

   s.setStatus(req.status());
   if (req.temperatureC() != null) s.setTemperatureC(req.temperatureC());
   if (req.humidity() != null)    s.setHumidity(req.humidity());
   s.setUpdatedAt(Instant.now());

   String where = (req.currentLocation() != null)
       ? req.currentLocation()
       : (s.getDestinationLocation() != null ? s.getDestinationLocation() : "NA");

// Replace the existing, too-long call with this:
trace.add(
    s.getBatchCode(),                      // batchCode
    s.getToStage(),                        // stage
    where,                                 // location (e.g., current or destination)
    "Shipment " + s.getShipmentId() +
    " marked " + req.status().name(),      // description
    me                                      // actor
);


   // Auto-add to inventory exactly once when moving to DELIVERED to a distributor
   if (req.status() == ShipmentStatus.DELIVERED
       && oldStatus != ShipmentStatus.DELIVERED
       && s.getToStage() == SupplyStage.DISTRIBUTOR) {
       // Map fields to your actual InventoryUpsertRequest signature
	   inventory.upsertByBatch(
			    new InventoryUpsertRequest(
			        s.getBatchCode(),                          // batchCode
			        s.getQuantityKg(),                         // quantityKg
			        s.getDestinationLocation() == null ? "Warehouse" : s.getDestinationLocation(), // location
			        null,                                      // grade (none from shipment)
			        s.getUnitPrice(),                          // pricePerKg (if present on shipment)
			        null,                                      // expiryDate (unknown here)
			        Boolean.TRUE,                              // qualityChecked (assume true on receipt)
			        "Auto-added from shipment " + s.getShipmentId() // notes
			    )
			);
   }

   return toResponse(shipments.save(s));
}


  private ShipmentResponse toResponse(Shipment s) {
	    User from = s.getFromUser();
	    User to = s.getToUser();

	    Long fromUserId = (from != null ? from.getId() : null);
	    String fromUserName = (from != null ? from.getFullName() : null);

	    Long toUserId = (to != null ? to.getId() : null);
	    String toUserName = (to != null ? to.getFullName() : null);

	    return new ShipmentResponse(
	        s.getId(),
	        s.getShipmentId(),
	        s.getBatchCode(),
	        s.getCrop().getId(),
	        s.getCrop().getName(),
	        s.getCrop().getType(),
	        fromUserId,
	        fromUserName,
	        toUserId,
	        toUserName,
	        s.getQuantityKg(),
	        s.getUnitPrice(),
	        s.getTotalValue(),
	        s.getOriginLocation(),
	        s.getDestinationLocation(),
	        s.getVehicle(),
	        s.getTemperatureC(),
	        s.getHumidity(),
	        s.getStatus(),
	        s.getFromStage(),
	        s.getToStage(),
	        s.getCreatedAt(),
	        s.getUpdatedAt(),
	        s.getExpectedDelivery()
	    );
	
  }
}
