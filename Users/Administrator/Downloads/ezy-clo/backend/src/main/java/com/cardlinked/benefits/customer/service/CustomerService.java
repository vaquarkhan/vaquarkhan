package com.cardlinked.benefits.customer.service;

import com.cardlinked.benefits.customer.entity.Customer;
import com.cardlinked.benefits.customer.entity.Card;
import com.cardlinked.benefits.customer.repository.CustomerRepository;
import com.cardlinked.benefits.customer.repository.CardRepository;
import com.cardlinked.benefits.common.exception.CustomerNotFoundException;
import com.cardlinked.benefits.common.exception.DuplicateCustomerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CardRepository cardRepository;
    private final GoldenRecordsService goldenRecordsService;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, 
                          CardRepository cardRepository,
                          GoldenRecordsService goldenRecordsService) {
        this.customerRepository = customerRepository;
        this.cardRepository = cardRepository;
        this.goldenRecordsService = goldenRecordsService;
    }

    // Create customer with golden records validation
    public Customer createCustomer(Customer customer) {
        // Generate UUID if not provided
        if (customer.getCustomerId() == null) {
            customer.setCustomerId(UUID.randomUUID().toString());
        }

        // Apply ExyCLO methodology for golden records
        Customer goldenRecord = goldenRecordsService.processCustomerRecord(customer);
        
        // Check for duplicates
        validateNoDuplicateCustomer(goldenRecord);
        
        return customerRepository.save(goldenRecord);
    }

    // Update customer with golden records validation
    public Customer updateCustomer(String customerId, Customer updatedCustomer) {
        Customer existingCustomer = getCustomerById(customerId);
        
        // Update fields
        existingCustomer.setFirstName(updatedCustomer.getFirstName());
        existingCustomer.setLastName(updatedCustomer.getLastName());
        existingCustomer.setEmail(updatedCustomer.getEmail());
        existingCustomer.setPhone(updatedCustomer.getPhone());
        existingCustomer.setDateOfBirth(updatedCustomer.getDateOfBirth());
        existingCustomer.setNationality(updatedCustomer.getNationality());
        existingCustomer.setSegmentType(updatedCustomer.getSegmentType());
        existingCustomer.setStatus(updatedCustomer.getStatus());
        
        // Apply golden records processing
        Customer goldenRecord = goldenRecordsService.processCustomerRecord(existingCustomer);
        
        return customerRepository.save(goldenRecord);
    }

    // Get customer by ID
    @Transactional(readOnly = true)
    public Customer getCustomerById(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + customerId));
    }

    // Get customer by encrypted PAN token
    @Transactional(readOnly = true)
    public Optional<Customer> getCustomerByPanToken(String encryptedPanToken) {
        return customerRepository.findByEncryptedPanToken(encryptedPanToken);
    }

    // Search customers
    @Transactional(readOnly = true)
    public Page<Customer> searchCustomers(String searchTerm, Pageable pageable) {
        return customerRepository.searchCustomers(searchTerm, pageable);
    }

    // Get customers by segment
    @Transactional(readOnly = true)
    public List<Customer> getCustomersBySegment(Customer.SegmentType segmentType) {
        return customerRepository.findBySegmentTypeAndStatus(segmentType, Customer.CustomerStatus.ACTIVE);
    }

    // Get customer analytics
    @Transactional(readOnly = true)
    public List<Object[]> getCustomerAnalyticsBySegment() {
        return customerRepository.countCustomersBySegmentAndStatus(Customer.CustomerStatus.ACTIVE);
    }

    // Golden Records - Find potential duplicates
    @Transactional(readOnly = true)
    public List<Customer> findPotentialDuplicates(String firstName, String lastName, LocalDate dateOfBirth) {
        return customerRepository.findPotentialDuplicates(firstName, lastName, dateOfBirth);
    }

    // Golden Records - Data quality check
    @Transactional(readOnly = true)
    public List<Customer> findCustomersWithMissingContactInfo() {
        return customerRepository.findCustomersWithMissingContactInfo();
    }

    // Golden Records - Find duplicate customers
    @Transactional(readOnly = true)
    public List<Customer> findDuplicateCustomers() {
        return customerRepository.findPotentialDuplicateCustomers();
    }

    // Customer lifecycle management
    public Customer activateCustomer(String customerId) {
        Customer customer = getCustomerById(customerId);
        customer.setStatus(Customer.CustomerStatus.ACTIVE);
        return customerRepository.save(customer);
    }

    public Customer suspendCustomer(String customerId, String reason) {
        Customer customer = getCustomerById(customerId);
        customer.setStatus(Customer.CustomerStatus.SUSPENDED);
        // Log the suspension reason in audit trail
        return customerRepository.save(customer);
    }

    public Customer deactivateCustomer(String customerId) {
        Customer customer = getCustomerById(customerId);
        customer.setStatus(Customer.CustomerStatus.INACTIVE);
        return customerRepository.save(customer);
    }

    // Customer cards management
    @Transactional(readOnly = true)
    public List<Card> getCustomerCards(String customerId) {
        return cardRepository.findByCustomerCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<Card> getActiveCustomerCards(String customerId) {
        Customer customer = getCustomerById(customerId);
        return cardRepository.findByCustomerAndStatus(customer, Card.CardStatus.ACTIVE);
    }

    // Analytics and reporting
    @Transactional(readOnly = true)
    public long getNewCustomersCount(LocalDateTime startDate, LocalDateTime endDate) {
        return customerRepository.countNewCustomersInPeriod(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Customer> getRecentCustomers(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return customerRepository.findRecentCustomers(cutoffDate);
    }

    // Data maintenance
    @Transactional(readOnly = true)
    public List<Customer> findStaleRecords(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return customerRepository.findStaleCustomerRecords(cutoffDate);
    }

    // Private helper methods
    private void validateNoDuplicateCustomer(Customer customer) {
        // Check for existing customer with same PAN token
        Optional<Customer> existingByPan = customerRepository.findByEncryptedPanToken(customer.getEncryptedPanToken());
        if (existingByPan.isPresent()) {
            throw new DuplicateCustomerException("Customer already exists with this PAN token");
        }

        // Check for potential duplicates based on personal information
        List<Customer> potentialDuplicates = customerRepository.findPotentialDuplicates(
            customer.getFirstName(), customer.getLastName(), customer.getDateOfBirth());
        
        if (!potentialDuplicates.isEmpty()) {
            // Additional validation logic can be added here
            // For now, we'll allow it but log for review
        }
    }
}