package com.farmchainx.api.distributor.services;

import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.distributor.dto.RetailerResponse;
import com.farmchainx.api.distributor.dto.RetailerUpsertRequest;
import com.farmchainx.api.distributor.entities.RetailerProfile;
import com.farmchainx.api.distributor.repo.RetailerRepository;
import com.farmchainx.api.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("distributorRetailerService")
public class DistributorRetailerService {

  private final RetailerRepository retailers;
  private final UserRepository users;

  public DistributorRetailerService(RetailerRepository retailers, UserRepository users) {
    this.retailers = retailers;
    this.users = users;
  }

  @Transactional(readOnly = true)
  public List<RetailerResponse> myRetailers() {
    var me = SecurityUtils.currentUser(users).orElseThrow();
    return retailers.findByDistributor(me).stream().map(this::toResponse).toList();
  }

  @Transactional
  public RetailerResponse upsert(Long id, RetailerUpsertRequest req) {
    var me = SecurityUtils.currentUser(users).orElseThrow();
    RetailerProfile r = (id == null) ? new RetailerProfile() : retailers.findById(id).orElseThrow();
    if (id != null && !r.getDistributor().getId().equals(me.getId())) throw new IllegalStateException("Not allowed");
    r.setDistributor(me);
    r.setName(req.name());
    r.setContact(req.contact());
    r.setPhone(req.phone());
    r.setEmail(req.email());
    r.setLocation(req.location());
    r.setCreditLimit(req.creditLimit());
    r.setRating(req.rating());
    r.setPreferredProducts(req.preferredProducts());
    r.setNotes(req.notes());
    if (req.retailerUserId() != null) {
      r.setRetailerUser(users.findById(req.retailerUserId()).orElse(null));
    }
    if (r.getOutstandingAmount() == null) r.setOutstandingAmount(0.0);
    return toResponse(retailers.save(r));
  }

  @Transactional
  public void delete(Long id) {
    var me = SecurityUtils.currentUser(users).orElseThrow();
    var r = retailers.findById(id).orElseThrow();
    if (!r.getDistributor().getId().equals(me.getId())) throw new IllegalStateException("Not allowed");
    retailers.delete(r);
  }

  private RetailerResponse toResponse(RetailerProfile r) {
    return new RetailerResponse(
        r.getId(), r.getName(), r.getContact(), r.getPhone(), r.getEmail(),
        r.getLocation(), r.getCreditLimit(), r.getOutstandingAmount(), r.getRating()
    );
  }
}
