package com.umerqureshicodes.backend.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

// Catches exceptions thrown from any controller and returns a clean error response
// instead of a generic 500 stack trace.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 400 — Bad Request
    // Thrown when request body fails validation (e.g. missing required fields, bad JSON)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Invalid request");
        return ResponseEntity.status(400).body(new ErrorResponse(400, message));
    }

    // 400 — Bad Request (catch-all for bad arguments)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(new ErrorResponse(400, e.getMessage()));
    }

    // 401 — Unauthorized
    // Thrown by DaoAuthenticationProvider when email/password don't match
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body(new ErrorResponse(401, "Invalid email or password"));
    }

    // 403 — Forbidden
    // Thrown when user is authenticated but doesn't have permission for the action
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(403).body(new ErrorResponse(403, "You don't have permission to do this"));
    }

    // 404 — Not Found
    // Thrown by .orElseThrow() when a DB lookup returns empty
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoSuchElementException e) {
        return ResponseEntity.status(404).body(new ErrorResponse(404, "Resource not found"));
    }

    // 409 — Conflict
    // Thrown when a unique constraint is violated (e.g. registering with an email that already exists)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException e) {
        return ResponseEntity.status(409).body(new ErrorResponse(409, "Resource already exists"));
    }

    // 500 — Your custom error with a specific message.
    // throw new GeneralException("whatever you want") → returns { status: 500, message: "whatever you want" }
    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(GeneralException e) {
        return ResponseEntity.status(500).body(new ErrorResponse(500, e.getMessage()));
    }

    // 500 — Catch-all for anything unexpected. This is the last resort.
    // Returns a generic message so internal details don't leak to the client.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception e) {
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Something went wrong"));
    }
}
