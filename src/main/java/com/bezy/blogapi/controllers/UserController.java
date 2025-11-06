package com.bezy.blogapi.controllers;

import com.bezy.blogapi.dtos.*;
import com.bezy.blogapi.entities.Role;
import com.bezy.blogapi.entities.User;
import com.bezy.blogapi.mappers.*;
import com.bezy.blogapi.repositories.*;
import com.bezy.blogapi.services.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final ProfileRepository profileRepository;
    private final UserMapper userMapper;
    private final CommentMapper commentMapper;
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final PostMapper postMapper;
    private final TagRepository tegRepository;
    private final ProfileMapper profileMapper;
    private final UserService userService;
    private final ProfileService profileService;
    private final TagService tagService;
    private final CategoryService categoryService;
    private final PasswordEncoder passwordEncoder;
    private CommentService commentService;
    private PostService postService;

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestBody RegisterUserRequest request
    ) {
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }
        User user = new User();
        user.setId(request.getId());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setConfirmPassword(request.getConfirmPassword());
        user.setRole(Role.USER);
        user.setCreatedAt(request.getCreatedAt());
        userRepository.save(user);
        return ResponseEntity.ok("User has been created!");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserById(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdateUserRequest request
    ){
        var user = userRepository.findById(id).orElse(null);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        userMapper.update(request, user);
        userRepository.save(user);

        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @GetMapping("/users")
    public Iterable<?> getAllUsers(

    ){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable Long id
    ){

        var user = userRepository.findById(id).orElse(null);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ){
        var  user = userRepository.findById(id).orElse(null);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        userRepository.delete(user);
        return ResponseEntity.ok("User has been deleted!");
    }

    @PostMapping("/comments")
    public ResponseEntity<?> createComment(
            @RequestBody RegisterCommentRequest request
    ){
        commentService.addComment(request);
        return ResponseEntity.ok("Comment has been added!");
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<?> updateCommentById(
            @PathVariable Long id,
            @RequestBody UpdateCommentRequest request
    ){
        commentService.updateCommentById(id, request);
        return ResponseEntity.ok("Comment has been updated!");
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteCommentById(
            @PathVariable Long id
    ){
        commentService.deleteCommentById(id);
        return ResponseEntity.ok("Comment has been removed!");
    }

    @GetMapping("/comments")
    public Iterable<CommentDto> getAllComments(){
        return commentRepository.findAll()
                .stream()
                .map(commentMapper::toDto)
                .toList();
    }

    @GetMapping("/comments/{id}")
    public ResponseEntity<?> getCommentById(
            @PathVariable Long id
    ){
        var comment = commentRepository.findById(id).orElse(null);
        if(comment == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(commentMapper.toDto(comment));
    }

    @PostMapping("/categories")
    public ResponseEntity<?> registerCategory(
            @RequestBody RegisterCategoryRequest request
    ){
        if(categoryRepository.findByName(request.getName()).isPresent()){
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        categoryService.addCategory(request);
        return ResponseEntity.ok("Category has been created!");
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request
    ){
        categoryService.updateCategoryById(id, request);
        return ResponseEntity.ok("Category has been updated!");
    }

    @GetMapping("/categories")
    public Iterable<CategoryDto> getAllCategories(){
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategoryById(
            @PathVariable Long id
    ){
        var category =  categoryRepository.findById(id).orElse(null);
        if(category == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategoryById(
            @PathVariable Long id
    ){
        var category = categoryRepository.findById(id).orElse(null);
        if(category == null){
            return ResponseEntity.notFound().build();
        }
        categoryRepository.delete(category);
        return ResponseEntity.ok("Category has been removed!");
    }

    @PostMapping("/tags")
    public ResponseEntity<?> createTag(
            @RequestBody RegisterTagRequest request
    ){
        if(tagRepository.findByName(request.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        tagService.addTag(request);
        return ResponseEntity.ok("Tag has been created successfully!");
    }

    @PutMapping("/tags/{id}")
    public ResponseEntity<?> updateTagById(
            @PathVariable Long id,
            @RequestBody UpdateTagRequest request
    ){
        tagService.updateTagById(id, request);
        return ResponseEntity.ok("Tag has been updated!");
    }

    @GetMapping("/tags")
    public Iterable<TagDto> getAllTags(){
        return tagRepository.findAll()
                .stream()
                .map(tagMapper::toDto)
                .toList();
    }

    @GetMapping("/tags/{id}")
    public ResponseEntity<?> getTagById(
            @PathVariable Long id
    ){
        var tag= tagRepository.findById(id).orElse(null);
        if(tag == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tagMapper.toDto(tag));
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<?> deleteTag(
            @PathVariable(name = "id") Long id
    ){
        var tag = tegRepository.findById(id).orElse(null);
        if(tag == null){
            return ResponseEntity.notFound().build();
        }

        tagRepository.delete(tag);
        return ResponseEntity.ok("Tag has been removed!");
    }

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(
            @RequestBody RegisterPostRequest request
    ){
        if(postRepository.findByTitle(request.getTitle()).isPresent()){
            return ResponseEntity.badRequest().body("Title already exists!");
        }

        postService.createPost(request);
        return ResponseEntity.ok("Post has been created!");
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<?> updatePostById(
            @PathVariable Long id,
            @RequestBody UpdatePostRequest request
    ){
        postService.updatePostById(id, request);
        return ResponseEntity.ok("Post has been updated successfully!");
    }

    @GetMapping("/posts")
    public Iterable<?> getAllPosts(){
        postService.getAllPosts();
        return postRepository.findAll();
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<?> getPostById(
            @PathVariable Long id
    ){
        postService.getPostById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePostById(
            @PathVariable Long id
    ){
        var post = postRepository.findById(id).orElse(null);
        if(post == null){
            return ResponseEntity.notFound().build();
        }
        postRepository.delete(post);
        return ResponseEntity.ok("Post has been deleted successfully!");
    }

    @PostMapping("/profiles")
    public ResponseEntity<?> createProfile(
            @RequestBody RegisterProfileRequest request
    ){
        if(profileRepository.findByBio(request.getBio()).isPresent()){
            return ResponseEntity.ok("User bio is already in use!");
        }

        profileService.createProfile(request);
        return ResponseEntity.ok("Profile has been created!");
    }

    @PutMapping("/profiles/{id}")
    public ResponseEntity<?> updateProfileById(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ){
        profileService.updateProfileById(id, request);
        return ResponseEntity.ok("Profile has been updated successfully!");
    }

    @GetMapping("/profiles")
    public Iterable<?> getAllProfiles(){
        return profileRepository.findAll()
                .stream()
                .map(profileMapper::toDto)
                .toList();
    }

    @GetMapping("/profiles/{id}")
    public ResponseEntity<?> getProfileById(
            @PathVariable Long id
    ){
        var profile = profileRepository.findById(id).orElse(null);
        if(profile == null){
            return ResponseEntity.notFound().build();
        }
        profileMapper.toDto(profile);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/profiles/{id}")
    public ResponseEntity<?> deleteProfileById(
            @PathVariable Long id
    ){
        var profile = profileRepository.findById(id).orElse(null);
        if(profile == null){
            return ResponseEntity.notFound().build();
        }
        profileRepository.delete(profile);
        return ResponseEntity.ok("Profile has been deleted successfully!");
    }

}
