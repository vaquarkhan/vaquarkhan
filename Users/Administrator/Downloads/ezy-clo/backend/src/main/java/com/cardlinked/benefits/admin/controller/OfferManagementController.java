package com.cardlinked.benefits.admin.controller;

import com.cardlinked.benefits.offers.entity.Offer;
import com.cardlinked.benefits.offers.service.OfferService;
import com.cardlinked.benefits.admin.service.AdminService;
import com.cardlinked.benefits.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/admin/offers")
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class OfferManagementController {

    private final OfferService offerService;
    private final AdminService adminService;

    public OfferManagementController(OfferService offerService, AdminService adminService) {
        this.offerService = offerService;
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        List<Offer> offers = offerService.getAllOffers();
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOffer(@PathVariable String id) {
        Offer offer = offerService.getOfferById(id);
        return ResponseEntity.ok(offer);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_OFFER')")
    public ResponseEntity<ApiResponse<Offer>> createOffer(@RequestBody Offer offer) {
        try {
            // Create offer in draft status for approval workflow
            offer.setStatus(Offer.OfferStatus.DRAFT);
            Offer createdOffer = offerService.createOffer(offer);
            
            // Trigger approval workflow
            adminService.submitForApproval(createdOffer.getOfferId(), "OFFER", "CREATE");
            
            log.info("Offer created and submitted for approval: {}", createdOffer.getOfferId());
            return ResponseEntity.ok(ApiResponse.success("Offer created and submitted for approval", createdOffer));
            
        } catch (Exception e) {
            log.error("Error creating offer", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to create offer: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_OFFER')")
    public ResponseEntity<ApiResponse<Offer>> updateOffer(@PathVariable String id, @RequestBody Offer offer) {
        try {
            offer.setOfferId(id);
            Offer updatedOffer = offerService.updateOffer(offer);
            
            // Trigger approval workflow for updates
            adminService.submitForApproval(id, "OFFER", "UPDATE");
            
            log.info("Offer updated and submitted for approval: {}", id);
            return ResponseEntity.ok(ApiResponse.success("Offer updated and submitted for approval", updatedOffer));
            
        } catch (Exception e) {
            log.error("Error updating offer: {}", id, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update offer: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_OFFER')")
    public ResponseEntity<ApiResponse<Void>> deleteOffer(@PathVariable String id) {
        try {
            // Submit for approval before actual deletion
            adminService.submitForApproval(id, "OFFER", "DELETE");
            
            log.info("Offer deletion submitted for approval: {}", id);
            return ResponseEntity.ok(ApiResponse.success("Offer deletion submitted for approval", null));
            
        } catch (Exception e) {
            log.error("Error deleting offer: {}", id, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete offer: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('ACTIVATE_OFFER')")
    public ResponseEntity<ApiResponse<Offer>> activateOffer(@PathVariable String id) {
        try {
            Offer offer = offerService.activateOffer(id);
            log.info("Offer activated: {}", id);
            return ResponseEntity.ok(ApiResponse.success("Offer activated successfully", offer));
            
        } catch (Exception e) {
            log.error("Error activating offer: {}", id, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to activate offer: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('DEACTIVATE_OFFER')")
    public ResponseEntity<ApiResponse<Offer>> deactivateOffer(@PathVariable String id) {
        try {
            Offer offer = offerService.deactivateOffer(id);
            log.info("Offer deactivated: {}", id);
            return ResponseEntity.ok(ApiResponse.success("Offer deactivated successfully", offer));
            
        } catch (Exception e) {
            log.error("Error deactivating offer: {}", id, e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to deactivate offer: " + e.getMessage()));
        }
    }

    @GetMapping("/pending-approval")
    @PreAuthorize("hasAuthority('VIEW_PENDING_APPROVALS')")
    public ResponseEntity<List<Offer>> getPendingApprovalOffers() {
        List<Offer> pendingOffers = offerService.getOffersByStatus(Offer.OfferStatus.PENDING_APPROVAL);
        return ResponseEntity.ok(pendingOffers);
    }
}