package com.pharma.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(
                        MethodArgumentNotValidException ex) {

                Map<String, String> fieldErrors = new LinkedHashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(
                                                fieldError -> fieldErrors.putIfAbsent(
                                                                fieldError.getField(),
                                                                fieldError.getDefaultMessage()));

                String message = fieldErrors.values()
                                .stream()
                                .findFirst()
                                .orElse(
                                                "Dữ liệu không hợp lệ");

                Map<String, Object> body = new LinkedHashMap<>();

                body.put(
                                "timestamp",
                                LocalDateTime.now());

                body.put(
                                "status",
                                HttpStatus.BAD_REQUEST.value());

                body.put(
                                "error",
                                HttpStatus.BAD_REQUEST
                                                .getReasonPhrase());

                body.put(
                                "message",
                                message);

                body.put(
                                "fieldErrors",
                                fieldErrors);

                return ResponseEntity
                                .badRequest()
                                .body(body);
        }

        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<Map<String, Object>> handleResponseStatusException(
                        ResponseStatusException ex) {

                HttpStatusCode statusCode = ex.getStatusCode();

                HttpStatus httpStatus = HttpStatus.resolve(
                                statusCode.value());

                String error = httpStatus != null
                                ? httpStatus.getReasonPhrase()
                                : "HTTP Error";

                String message = ex.getReason() != null
                                && !ex.getReason().isBlank()
                                                ? ex.getReason()
                                                : "Không thể thực hiện yêu cầu.";

                Map<String, Object> body = new LinkedHashMap<>();

                body.put(
                                "timestamp",
                                LocalDateTime.now());

                body.put(
                                "status",
                                statusCode.value());

                body.put(
                                "error",
                                error);

                body.put(
                                "message",
                                message);

                return ResponseEntity
                                .status(statusCode)
                                .body(body);
        }
}