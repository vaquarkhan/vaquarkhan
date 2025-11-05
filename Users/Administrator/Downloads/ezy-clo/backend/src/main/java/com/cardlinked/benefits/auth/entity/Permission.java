package com.cardlinked.benefits.auth.entity;

import com.cardlinked.benefits.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "permissions", indexes = {
    @Index(name = "idx_permission_name", columnList = "name", unique = true),
    @Index(name = "idx_permission_module", columnList = "module")
})
public class Permission extends BaseEntity {

    @Id
    @Column(name = "permission_id", length = 36)
    private String permissionId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Size(max = 50)
    @Column(name = "module", length = 50)
    private String module;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission_type")
    private PermissionType permissionType;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles = new HashSet<>();

    // Constructors
    public Permission() {
        super();
    }

    public Permission(String permissionId, String name, String description, String module, PermissionType permissionType) {
        this();
        this.permissionId = permissionId;
        this.name = name;
        this.description = description;
        this.module = module;
        this.permissionType = permissionType;
    }

    // Getters and Setters
    public String getPermissionId() { return permissionId; }
    public void setPermissionId(String permissionId) { this.permissionId = permissionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public PermissionType getPermissionType() { return permissionType; }
    public void setPermissionType(PermissionType permissionType) { this.permissionType = permissionType; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    // Enums
    public enum PermissionType {
        READ, WRITE, DELETE, EXECUTE, ADMIN
    }

    // Static factory methods for common permissions
    public static Permission createReadPermission(String module, String resource) {
        return new Permission(
            null,
            module.toUpperCase() + "_" + resource.toUpperCase() + "_READ",
            "Read access to " + resource + " in " + module,
            module,
            PermissionType.READ
        );
    }

    public static Permission createWritePermission(String module, String resource) {
        return new Permission(
            null,
            module.toUpperCase() + "_" + resource.toUpperCase() + "_WRITE",
            "Write access to " + resource + " in " + module,
            module,
            PermissionType.WRITE
        );
    }

    public static Permission createDeletePermission(String module, String resource) {
        return new Permission(
            null,
            module.toUpperCase() + "_" + resource.toUpperCase() + "_DELETE",
            "Delete access to " + resource + " in " + module,
            module,
            PermissionType.DELETE
        );
    }

    public static Permission createAdminPermission(String module) {
        return new Permission(
            null,
            module.toUpperCase() + "_ADMIN",
            "Administrative access to " + module,
            module,
            PermissionType.ADMIN
        );
    }
}