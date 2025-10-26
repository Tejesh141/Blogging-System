package com.examly.springapp.controller;

import com.examly.springapp.model.BlogPost;
import com.examly.springapp.repository.BlogPostRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class BlogPostController {

    @Autowired
    private BlogPostRepository repository;

    @GetMapping
    public List<BlogPost> getAllPosts() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<BlogPost> post = repository.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Blog post not found with id: " + id));
    }

    @PostMapping
    public ResponseEntity<BlogPost> createPost(@Valid @RequestBody BlogPost post) {
        BlogPost savedPost = repository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @Valid @RequestBody BlogPost postDetails) {
        Optional<BlogPost> optionalPost = repository.findById(id);
        if (optionalPost.isPresent()) {
            BlogPost post = optionalPost.get();
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setAuthor(postDetails.getAuthor());
            BlogPost updatedPost = repository.save(post);
            return ResponseEntity.ok(updatedPost);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Blog post not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Optional<BlogPost> post = repository.findById(id);
        if (post.isPresent()) {
            repository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Blog post deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Blog post not found with id: " + id));
    }
}