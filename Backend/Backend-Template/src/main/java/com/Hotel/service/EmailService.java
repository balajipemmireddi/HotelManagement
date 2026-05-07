package com.Hotel.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.Hotel.entity.Booking;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * PHASE 10 — Email Notification Service (Async).
 *
 * Sends booking confirmation and cancellation emails without blocking.
 * Uses @Async to run in separate thread pool.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    // Note: JavaMailSender would be injected here in production
    // private final JavaMailSender mailSender;

    /**
     * Send booking confirmation email asynchronously.
     * Called after successful booking creation.
     */
    @Async
    public void sendBookingConfirmation(Booking booking) {
        log.info("📧 [ASYNC] Sending booking confirmation email for booking: {}",
                booking.getBookingReference());

        try {
            // Simulate email sending delay
            Thread.sleep(2000);

            // In production, would use JavaMailSender:
            // MimeMessage message = mailSender.createMimeMessage();
            // MimeMessageHelper helper = new MimeMessageHelper(message, true);
            // helper.setTo(booking.getUser().getEmail());
            // helper.setSubject("Booking Confirmation - " + booking.getBookingReference());
            // helper.setText(buildConfirmationEmailHtml(booking), true);
            // mailSender.send(message);

            log.info("✅ [ASYNC] Booking confirmation email sent successfully for: {}",
                    booking.getBookingReference());

        } catch (Exception e) {
            log.error("❌ [ASYNC] Failed to send booking confirmation email for: {}",
                    booking.getBookingReference(), e);
        }
    }

    /**
     * Send booking cancellation email asynchronously.
     * Called after successful booking cancellation.
     */
    @Async
    public void sendCancellationEmail(Booking booking) {
        log.info("📧 [ASYNC] Sending cancellation email for booking: {}",
                booking.getBookingReference());

        try {
            // Simulate email sending delay
            Thread.sleep(2000);

            // In production, would use JavaMailSender
            log.info("✅ [ASYNC] Cancellation email sent successfully for: {}",
                    booking.getBookingReference());

        } catch (Exception e) {
            log.error("❌ [ASYNC] Failed to send cancellation email for: {}",
                    booking.getBookingReference(), e);
        }
    }

    /**
     * Build HTML email template for booking confirmation.
     * In production, would use Thymeleaf or similar template engine.
     */
    private String buildConfirmationEmailHtml(Booking booking) {
        return String.format("""
                <html>
                <body>
                    <h2>Booking Confirmation</h2>
                    <p>Dear Customer,</p>
                    <p>Your booking has been confirmed!</p>
                    <p><strong>Booking Reference:</strong> %s</p>
                    <p><strong>Hotel:</strong> %s</p>
                    <p><strong>Check-in:</strong> %s</p>
                    <p><strong>Check-out:</strong> %s</p>
                    <p><strong>Total Amount:</strong> $%.2f</p>
                    <p>Thank you for choosing us!</p>
                </body>
                </html>
                """,
                booking.getBookingReference(),
                booking.getHotel().getName(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getFinalAmount()
        );
    }
}
