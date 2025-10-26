package com.examly.springapp.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Map;

@Controller
public class HomeController implements ErrorController {

    @GetMapping("/")
    @ResponseBody
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of("message", "Blog API is running", "endpoints", "/api/posts"));
    }

    @RequestMapping("/error")
    @ResponseBody
    public ResponseEntity<?> handleError() {
        return ResponseEntity.ok(Map.of("message", "Blog API is running", "endpoints", "/api/posts"));
    }
}