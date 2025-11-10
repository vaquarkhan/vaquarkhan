-- Seed data aligned with backend/src/main/resources/data.sql

INSERT INTO customers (first_name, last_name, email, phone_number, preferred_language, home_airport, loyalty_tier, points_balance) VALUES
('Aisha', 'Khan', 'aisha.khan@example.com', '+971500000001', 'en', 'DXB', 'Platinum', 285000),
('Marc', 'Lefevre', 'marc.lefevre@example.com', '+33160000002', 'fr', 'CDG', 'Gold', 142500);

INSERT INTO services (code, name, description, category, base_price, currency, service_level_agreement, premium_only) VALUES
('LUX-CHAUFFEUR', 'Luxury Chauffeur', 'Executive chauffeur-driven transfer in premium vehicles.', 'Mobility', 450.00, 'USD', 'Vehicle staged 30 min prior, concierge meet & greet', true),
('AIR-ASSIST', 'Airport Assistance', 'Fast-track immigration, porter, and lounge coordination.', 'Airport', 250.00, 'USD', 'Escort from curb to gate within 20 minutes', false),
('MED-CONCIERGE', 'Medical Concierge', 'On-demand access to private clinics and remote physician consults.', 'Concierge', 600.00, 'USD', 'Doctor consult arranged within 4 hours', true),
('SHOP-STYLIST', 'Personal Shopping', 'Luxury retail appointments with stylist accompaniment.', 'Lifestyle', 180.00, 'USD', 'Stylist confirmation within 2 hours', false),
('SEA-YACHT', 'Yacht Charter', 'Crewed superyacht experiences across the Arabian Gulf.', 'Experiences', 8500.00, 'USD', '72-hour notice, dedicated concierge and crew briefing', true),
('SKY-HELI', 'Helicopter Transfer', 'Point-to-point helicopter transfers with VIP lounges.', 'Experiences', 3200.00, 'USD', 'Helipad slot secured 24 hours prior', true),
('JET-PRIV', 'Private Jet Charter', 'Global private jet network with bespoke in-flight services.', 'Experiences', 12500.00, 'USD', 'Flight plan filed within 60 minutes, crew curated menus', true);

INSERT INTO chauffeurs (name, image, tagline, phone_number, email, vehicle_type, rating, languages) VALUES
('Youssef Al-Farsi', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop', '15+ years of executive transport experience.', '+971500000010', 'youssef@premobility.com', 'Mercedes-Maybach S680', 4.9, 'en,ar'),
('Isabelle Dubois', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop', 'Discreet, professional, and multilingual.', '+33170000011', 'isabelle@premobility.com', 'BMW 7 Series', 4.8, 'en,fr,de'),
('Omar Khan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', 'Expert in navigating the city with comfort.', '+971500000012', 'omar@premobility.com', 'Range Rover Autobiography', 4.7, 'en,ur');

-- Admin user is provisioned automatically by DataInitializer at runtime

INSERT INTO bookings (service_type, details, date, status, origin_address, destination_address, pickup_time, dropoff_time, passenger_count, special_requests, payment_status, total_amount, currency, customer_id, service_id, chauffeur_id) VALUES
('Luxury Chauffeur', 'Pickup for Flight EK201 with onboard refreshments.', '2025-11-09T06:30:00Z', 'Confirmed', 'Dubai International Airport (DXB)', 'Burj Khalifa, Downtown Dubai', '2025-11-09T07:00:00Z', '2025-11-09T07:45:00Z', 2, 'Evian water, Arabic newspapers', 'Paid', 520.00, 'USD', 1, 1, 1),
('Airport Assistance', 'Fast-track arrival for VIP family.', '2025-11-10T11:30:00Z', 'Confirmed', NULL, NULL, '2025-11-10T12:00:00Z', NULL, 4, 'Coordinate buggy for elderly guest', 'Pending', 250.00, 'USD', 2, 2, NULL),
('Medical Concierge', 'Private clinic appointment for executive health screening.', '2025-11-11T08:00:00Z', 'In Progress', 'Emirates Towers', 'Dubai Healthcare City', '2025-11-11T09:30:00Z', '2025-11-11T12:00:00Z', 1, 'Keep medical history ready', 'Deposit Paid', 780.00, 'USD', 1, 3, 2),
('Personal Shopping', 'Luxury retail tour at Mall of the Emirates.', '2025-11-12T14:00:00Z', 'Scheduled', 'Burj Al Arab', 'Mall of the Emirates', '2025-11-12T15:00:00Z', '2025-11-12T19:00:00Z', 1, 'Stylists to prepare jewellery collection', 'Quoted', 320.00, 'USD', 2, 4, 3);

INSERT INTO concierge_requests (customer_id, service_id, request_type, priority, status, requested_on, due_on, assigned_to, notes) VALUES
(1, 3, 'Medical Appointment', 'High', 'In Progress', '2025-11-10T06:00:00', '2025-11-10T12:00:00', 'Dr. Sara Rahman', 'Arrange VIP suite, collect prior reports'),
(2, 4, 'Luxury Shopping', 'Medium', 'Scheduled', '2025-11-08T14:30:00', '2025-11-12T15:00:00', 'Lina D''Costa', 'Confirm availability of rare timepieces'),
(1, NULL, 'Dining Reservation', 'High', 'Awaiting Confirmation', '2025-11-10T18:15:00', '2025-11-11T21:00:00', 'Omar Latif', 'Secure Chef''s table at Ossiano, allergy-friendly menu');

INSERT INTO insurance_products (code, name, coverage_summary, region, base_premium, currency, terms_url, max_trip_length_days) VALUES
('TRAVEL-ELITE', 'Travel Elite Protection', 'Worldwide coverage including trip cancellation, medical evacuation, and lost luggage.', 'Global', 320.00, 'USD', 'https://premium-mobility.example.com/insurance/travel-elite', 60),
('MENA-BUSINESS', 'MENA Business Shield', 'Regional business travel plan covering emergency medical, equipment loss, and delay concierge.', 'Middle East & North Africa', 210.00, 'USD', 'https://premium-mobility.example.com/insurance/mena-business', 30);

INSERT INTO insurance_quotes (product_id, customer_id, booking_id, quote_reference, premium_amount, currency, coverage_start, coverage_end, status) VALUES
(1, 1, 1, 'QE-2025-1109-AK', 355.00, 'USD', '2025-11-09', '2025-11-20', 'Issued'),
(2, 2, 2, 'QE-2025-1110-ML', 225.00, 'USD', '2025-11-10', '2025-11-25', 'Pending Payment');

INSERT INTO esim_packages (code, name, region, data_allowance_gb, validity_days, price, currency, partner) VALUES
('ESIM-GLOBAL-20', 'Global 20GB Explorer', 'Global', 20.0, 30, 180.00, 'USD', 'AirLink Global'),
('ESIM-MENA-10', 'MENA 10GB Executive', 'Middle East & North Africa', 10.0, 21, 110.00, 'USD', 'GulfNet Partners');

INSERT INTO esim_orders (package_id, customer_id, booking_id, order_number, status, activation_code, ordered_on, activated_on) VALUES
(1, 1, 1, 'EO-2025-1109-001', 'Activated', 'ACT-GLB-2025-1109-AK', '2025-11-08T22:10:00', '2025-11-09T06:05:00'),
(2, 2, 2, 'EO-2025-1110-002', 'Awaiting Activation', 'ACT-MENA-2025-1110-ML', '2025-11-09T10:45:00', NULL);

INSERT INTO partner_offers (title, partner_name, description, region, benefit_summary, loyalty_tier_required, terms_url, valid_from, valid_to) VALUES
('Amara Private Islands Retreat', 'Amara Resorts', 'Exclusive overwater villas with private butler and curated marine excursions.', 'Indian Ocean', 'Complimentary seaplane transfer + 20% spa credit', 'Platinum', 'https://premium-mobility.example.com/partners/amara', '2025-10-01', '2026-03-31'),
('Maison Delacroix Couture Preview', 'Maison Delacroix', 'Invite-only couture trunk show with atelier fittings in Paris.', 'Europe', 'First-look fittings + champagne atelier experience', 'Gold', 'https://premium-mobility.example.com/partners/delacroix', '2025-11-01', '2025-12-31');

INSERT INTO experience_bookings (customer_id, service_id, experience_type, title, description, status, start_time, end_time, departure_location, arrival_location, guests, operator_name, asset_details, total_amount, currency) VALUES
(1, 5, 'Yacht', 'Sunset Gulf Charter', '75-meter superyacht sunset cruise with private chef and DJ.', 'Confirmed', '2025-11-13T16:00:00', '2025-11-13T22:00:00', 'Dubai Marina', 'Palm Jumeirah', 8, 'Azure Fleet', '75m Majesty with 6 crew', 9200.00, 'USD'),
(2, 6, 'Helicopter', 'Abu Dhabi Cultural Heli-Hop', 'Helicopter transfer with Louvre Abu Dhabi private docent tour.', 'Scheduled', '2025-11-15T10:30:00', '2025-11-15T13:30:00', 'Dubai South VIP Terminal', 'Abu Dhabi Al Bateen', 3, 'SkyLuxe Aviation', 'AgustaWestland AW139', 3600.00, 'USD'),
(1, 7, 'Private Jet', 'Zurich Strategy Summit Flight', 'Long-range jet charter with onboard boardroom configuration.', 'Quoted', '2025-11-20T05:00:00', '2025-11-20T13:00:00', 'Al Maktoum International', 'Zurich Kloten', 5, 'Global Jet Alliance', 'Gulfstream G700, bespoke catering', 15800.00, 'USD');

INSERT INTO loyalty_transactions (customer_id, transaction_type, points_change, balance_after, description, transaction_date) VALUES
(1, 'Flight Charter Bonus', 12500, 297500, 'Private jet charter bonus accrual', '2025-11-05T09:30:00'),
(1, 'Yacht Experience Redemption', -20000, 277500, 'Redeemed points toward sunset yacht charter', '2025-11-10T12:45:00'),
(2, 'Concierge Success Bonus', 4500, 147000, 'Reward for concierge request completion', '2025-11-09T08:20:00');

INSERT INTO feedback_entries (customer_id, booking_id, experience_id, rating, sentiment_score, channel, comments, submitted_at) VALUES
(1, 1, NULL, 5, 0.92, 'mobile-app', 'Youssef was impeccable—vehicle pre-cooled, itinerary sync exact.', '2025-11-09T08:15:00'),
(2, NULL, 2, 4, 0.67, 'concierge-portal', 'Heli lounge staff were great, slight delay at departure.', '2025-11-15T14:05:00'),
(1, NULL, 1, 5, 0.95, 'post-trip-email', 'Chef''s tasting menu on the yacht was outstanding.', '2025-11-14T09:10:00');

INSERT INTO secure_chat_threads (customer_id, subject, status, created_at, last_message_at) VALUES
(1, 'Pre-flight Wellness Check', 'Open', '2025-11-08T21:15:00', '2025-11-09T05:45:00'),
(2, 'Couture Preview Coordination', 'Resolved', '2025-11-07T10:05:00', '2025-11-07T18:30:00');

INSERT INTO secure_chat_messages (thread_id, sender_type, sender_name, message, sent_at, read_at, attachment_url) VALUES
(1, 'Customer', 'Aisha Khan', 'Can you confirm the in-flight spa therapist availability?', '2025-11-08T21:16:00', '2025-11-08T21:20:00', NULL),
(1, 'Concierge', 'Layla (Concierge)', 'Therapist confirmed. Sharing wellness menu shortly.', '2025-11-08T21:40:00', '2025-11-08T21:40:00', 'https://premium-mobility.example.com/docs/wellness-menu.pdf'),
(1, 'Concierge', 'Layla (Concierge)', 'Pre-flight vitamin IV drip scheduled for 05:30.', '2025-11-09T05:45:00', NULL, NULL),
(2, 'Customer', 'Marc Lefevre', 'Need to ensure private fitting room is fragrance-free.', '2025-11-07T10:07:00', '2025-11-07T10:08:00', NULL),
(2, 'Concierge', 'Omar (Concierge)', 'Confirmed fragrance-free prep. Attached atelier layout.', '2025-11-07T18:30:00', '2025-11-07T18:35:00', 'https://premium-mobility.example.com/docs/atelier-layout.jpg');

INSERT INTO translator_sessions (customer_id, source_language, target_language, transcript, created_at) VALUES
(1, 'en', 'ar', 'Hello, could you arrange a translator for the Dubai meeting? | مرحبًا، هل يمكنك ترتيب مترجم للاجتماع في دبي؟', '2025-11-08T09:45:00'),
(2, 'fr', 'en', 'Bonjour, pouvez-vous confirmer le service de conciergerie? | Hello, can you confirm the concierge service?', '2025-11-08T14:12:00');

INSERT INTO biometric_preferences (customer_id, preference_type, enabled, metadata, updated_at) VALUES
(1, 'FaceID', true, JSON_OBJECT('device', 'iPhone 16 Pro', 'lastEnrollment', '2025-10-30T08:00:00Z'), '2025-11-07T22:00:00'),
(1, 'VoicePrint', false, JSON_OBJECT('reason', 'Temporarily disabled by member'), '2025-11-05T18:45:00'),
(2, 'PalmVein', true, JSON_OBJECT('device', 'Concierge Tablet', 'location', 'Paris Lounge'), '2025-11-06T09:30:00');

INSERT INTO analytics_snapshots (snapshot_time, metric_key, metric_value, dimension, notes) VALUES
('2025-11-09T00:00:00', 'bookings.daily', 48.0000, 'global', 'Daily confirmed bookings across network'),
('2025-11-09T00:00:00', 'loyalty.redemptionRate', 0.1850, 'MEA', 'Points redemption ratio for Middle East members'),
('2025-11-09T12:00:00', 'ai.uptime', 0.9990, 'production', 'Gemini concierge service rolling uptime');

INSERT INTO ai_interactions (customer_id, channel, endpoint, prompt_excerpt, response_excerpt, tokens_used, latency_ms, success, created_at) VALUES
(1, 'mobile-app', '/api/ai/travel-companion', 'Plan a wellness-focused layover in Zurich...', 'Proposed spa appointments and clean-eating itinerary...', 312, 842, true, '2025-11-08T23:05:00'),
(2, 'web', '/api/ai/checklist', 'Need couture trip checklist for Paris show...', 'Generated packing list with VIP access reminders...', 198, 455, true, '2025-11-07T08:22:00'),
(1, 'voice', '/api/ai/live-translate', 'Arabic <> English live translation session', 'Live translation session recorded (see transcript)', 544, 1120, true, '2025-11-08T09:45:10');

